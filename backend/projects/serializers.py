from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    technology_count = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'long_description',
            'image_url', 'demo_url', 'github_url', 'technologies',
            'featured', 'status', 'order', 'start_date', 'end_date',
            'client', 'team_size', 'created_at', 'updated_at',
            'technology_count', 'is_completed'
        ]

class ProjectListSerializer(serializers.ModelSerializer):
    """Serializer for project list view with minimal fields"""
    technology_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image_url', 'demo_url',
            'github_url', 'technologies', 'featured', 'status',
            'created_at', 'technology_count'
        ]