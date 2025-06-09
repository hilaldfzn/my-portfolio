from rest_framework import serializers
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    content_html = serializers.ReadOnlyField()
    excerpt_text = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'content_html',
            'excerpt_text', 'image_url', 'published', 'tags', 'read_time',
            'meta_description', 'meta_keywords', 'view_count', 'featured',
            'created_at', 'updated_at'
        ]

class ArticleListSerializer(serializers.ModelSerializer):
    """Serializer for article list view with minimal fields"""
    excerpt_text = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'excerpt_text',
            'image_url', 'tags', 'read_time', 'view_count',
            'featured', 'created_at'
        ]

class ArticleDetailSerializer(serializers.ModelSerializer):
    """Serializer for article detail view with full content"""
    content_html = serializers.ReadOnlyField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'content_html',
            'image_url', 'tags', 'read_time', 'meta_description',
            'meta_keywords', 'view_count', 'created_at', 'updated_at'
        ]