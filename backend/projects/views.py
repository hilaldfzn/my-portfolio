from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['featured', 'status', 'technologies']
    search_fields = ['title', 'description', 'long_description', 'technologies', 'client']
    ordering_fields = ['created_at', 'title', 'order', 'start_date']
    ordering = ['-featured', 'order', '-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        
        # Filter by technology
        tech = self.request.query_params.get('tech', None)
        if tech:
            queryset = queryset.filter(technologies__icontains=tech)
        
        # Filter by year
        year = self.request.query_params.get('year', None)
        if year:
            queryset = queryset.filter(created_at__year=year)
            
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get only featured projects"""
        featured_projects = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def technologies(self, request):
        """Get list of all technologies used across projects"""
        projects = self.get_queryset()
        technologies = set()
        
        for project in projects:
            if project.technologies:
                technologies.update(project.technologies)
        
        return Response(sorted(list(technologies)))

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get project statistics"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'completed': queryset.filter(status='completed').count(),
            'in_progress': queryset.filter(status='in_progress').count(),
            'featured': queryset.filter(featured=True).count(),
            'technologies_count': len(set().union(*[p.technologies or [] for p in queryset])),
        }
        
        return Response(stats)