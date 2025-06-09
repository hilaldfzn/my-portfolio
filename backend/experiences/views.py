from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg
from .models import Experience, Skill, Resume
from .serializers import ExperienceSerializer, SkillSerializer, ResumeSerializer

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['current', 'employment_type', 'technologies']
    search_fields = ['company', 'position', 'description', 'location']
    ordering_fields = ['start_date', 'company', 'order']
    ordering = ['-current', '-start_date', 'order']

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current positions only"""
        current_positions = self.get_queryset().filter(current=True)
        serializer = self.get_serializer(current_positions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def skills(self, request):
        """Get all skills"""
        skills = Skill.objects.all()
        
        # Filter by category if provided
        category = request.query_params.get('category')
        if category:
            skills = skills.filter(category=category)
        
        # Filter by featured if provided
        featured = request.query_params.get('featured')
        if featured:
            skills = skills.filter(featured=True)
        
        serializer = SkillSerializer(skills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def skills_by_category(self, request):
        """Get skills grouped by category"""
        skills = Skill.objects.all()
        skills_by_category = {}
        
        for skill in skills:
            category = skill.category
            if category not in skills_by_category:
                skills_by_category[category] = []
            
            skills_by_category[category].append(SkillSerializer(skill).data)
        
        return Response(skills_by_category)

    @action(detail=False, methods=['get'])
    def resume(self, request):
        """Get current active resume"""
        try:
            resume = Resume.objects.filter(active=True).first()
            if resume:
                serializer = ResumeSerializer(resume)
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'No active resume found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        except Resume.DoesNotExist:
            return Response(
                {'error': 'Resume not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get experience and skills statistics"""
        experiences = self.get_queryset()
        skills = Skill.objects.all()
        
        # Calculate total years of experience
        total_months = 0
        for exp in experiences:
            from datetime import date
            from dateutil.relativedelta import relativedelta
            
            end = exp.end_date or date.today()
            delta = relativedelta(end, exp.start_date)
            total_months += delta.years * 12 + delta.months
        
        total_years = round(total_months / 12, 1)
        
        stats = {
            'total_experience_years': total_years,
            'total_positions': experiences.count(),
            'current_positions': experiences.filter(current=True).count(),
            'total_skills': skills.count(),
            'skill_categories': skills.values_list('category', flat=True).distinct().count(),
            'average_skill_proficiency': skills.aggregate(
                avg=Avg('proficiency')
            )['avg'] or 0,
            'companies_worked': experiences.values_list('company', flat=True).distinct().count(),
        }
        
        return Response(stats)