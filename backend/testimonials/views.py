from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Testimonial
from django.db import models
from .serializers import TestimonialSerializer

class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['featured', 'rating', 'approved', 'company']
    search_fields = ['name', 'company', 'content', 'role']
    ordering_fields = ['created_at', 'rating', 'order']
    ordering = ['-featured', 'order', '-created_at']

    def get_queryset(self):
        return Testimonial.objects.filter(approved=True)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get only featured testimonials"""
        featured_testimonials = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(featured_testimonials, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_rating(self, request):
        """Get testimonials filtered by minimum rating"""
        min_rating = request.query_params.get('min_rating', 4)
        try:
            min_rating = int(min_rating)
            testimonials = self.get_queryset().filter(rating__gte=min_rating)
            serializer = self.get_serializer(testimonials, many=True)
            return Response(serializer.data)
        except ValueError:
            return Response({'error': 'Invalid rating value'}, status=400)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get testimonial statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'featured': queryset.filter(featured=True).count(),
            'average_rating': queryset.aggregate(
                avg_rating=models.Avg('rating')
            )['avg_rating'] or 0,
            'rating_distribution': {
                str(i): queryset.filter(rating=i).count() 
                for i in range(1, 6)
            }
        }
        
        return Response(stats)