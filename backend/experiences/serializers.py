from rest_framework import serializers
from .models import Experience, Skill, Resume

class ExperienceSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField()
    
    class Meta:
        model = Experience
        fields = [
            'id', 'company', 'position', 'description', 'start_date',
            'end_date', 'current', 'location', 'company_url', 'logo_url',
            'technologies', 'employment_type', 'achievements', 'order',
            'created_at', 'duration'
        ]

class SkillSerializer(serializers.ModelSerializer):
    proficiency_level = serializers.ReadOnlyField()
    
    class Meta:
        model = Skill
        fields = [
            'id', 'name', 'category', 'proficiency', 'proficiency_level',
            'icon', 'years_experience', 'featured', 'order', 'created_at'
        ]

class ResumeSerializer(serializers.ModelSerializer):
    file_size_formatted = serializers.ReadOnlyField()
    
    class Meta:
        model = Resume
        fields = [
            'id', 'file_url', 'file_name', 'file_size', 'file_size_formatted',
            'active', 'version', 'description', 'created_at'
        ]