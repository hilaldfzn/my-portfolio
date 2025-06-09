from rest_framework import serializers
from .models import Testimonial

class TestimonialSerializer(serializers.ModelSerializer):
    star_rating = serializers.ReadOnlyField()
    short_content = serializers.ReadOnlyField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'company', 'content', 'short_content',
            'avatar_url', 'rating', 'star_rating', 'featured',
            'project_related', 'linkedin_url', 'approved',
            'order', 'created_at'
        ]