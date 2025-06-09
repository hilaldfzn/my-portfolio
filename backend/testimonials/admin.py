from django.contrib import admin
from django.utils.html import format_html
from .models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'rating_stars', 'featured', 'approved', 'created_at']
    list_filter = ['featured', 'approved', 'rating', 'created_at', 'company']
    search_fields = ['name', 'company', 'content', 'role']
    list_editable = ['featured', 'approved', 'rating']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'role', 'company', 'avatar_url', 'linkedin_url')
        }),
        ('Testimonial', {
            'fields': ('content', 'rating', 'project_related')
        }),
        ('Display Settings', {
            'fields': ('featured', 'approved', 'order')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def rating_stars(self, obj):
        """Display rating as stars"""
        return format_html(
            '<span style="color: gold;">{}</span>',
            "⭐" * obj.rating
        )
    rating_stars.short_description = 'Rating'