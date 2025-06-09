from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
from apps.projects.models import Project
from apps.blog.models import Article
from apps.testimonials.models import Testimonial
from apps.experiences.models import Experience, Skill

@api_view(['GET'])
@permission_classes([AllowAny])
def home_data(request):
    """
    API endpoint that returns all data needed for the homepage
    """
    try:
        # Get featured projects
        featured_projects = Project.objects.filter(featured=True, status='completed')[:6]
        
        # Get recent articles
        recent_articles = Article.objects.filter(published=True)[:6]
        
        # Get featured testimonials
        featured_testimonials = Testimonial.objects.filter(featured=True)[:6]
        
        # Get recent experiences
        recent_experiences = Experience.objects.all()[:4]
        
        # Get skills by category
        skills_by_category = {}
        for skill in Skill.objects.all():
            if skill.category not in skills_by_category:
                skills_by_category[skill.category] = []
            skills_by_category[skill.category].append({
                'name': skill.name,
                'proficiency': skill.proficiency,
                'icon': skill.icon
            })
        
        from apps.projects.serializers import ProjectSerializer
        from apps.blog.serializers import ArticleListSerializer
        from apps.testimonials.serializers import TestimonialSerializer
        from apps.experiences.serializers import ExperienceSerializer
        
        data = {
            'featured_projects': ProjectSerializer(featured_projects, many=True).data,
            'recent_articles': ArticleListSerializer(recent_articles, many=True).data,
            'featured_testimonials': TestimonialSerializer(featured_testimonials, many=True).data,
            'recent_experiences': ExperienceSerializer(recent_experiences, many=True).data,
            'skills_by_category': skills_by_category,
            'stats': {
                'total_projects': Project.objects.filter(status='completed').count(),
                'total_articles': Article.objects.filter(published=True).count(),
                'years_experience': 3,  # You can make this dynamic
                'technologies': Skill.objects.count(),
            }
        }
        
        return Response(data)
    except Exception as e:
        return Response(
            {'error': 'Failed to fetch home data', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def contact_form(request):
    """
    Handle contact form submissions
    """
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        if not all([name, email, subject, message]):
            return Response(
                {'error': 'All fields are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Send email (if configured)
        if settings.EMAIL_HOST_USER:
            try:
                send_mail(
                    subject=f'Portfolio Contact: {subject}',
                    message=f'From: {name} ({email})\n\n{message}',
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
            except Exception as e:
                # Log the error but don't fail the request
                print(f"Failed to send email: {e}")
        
        return Response({
            'message': 'Thank you for your message! I will get back to you soon.'
        })
        
    except Exception as e:
        return Response(
            {'error': 'Failed to send message', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )