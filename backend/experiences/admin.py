from django.contrib import admin
from django.utils.html import format_html
from .models import Experience, Skill, Resume

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['position', 'company', 'employment_type', 'start_date', 'end_date', 'current']
    list_filter = ['current', 'employment_type', 'start_date', 'company']
    search_fields = ['company', 'position', 'description']
    list_editable = ['current']
    readonly_fields = ['id', 'duration', 'created_at', 'updated_at']
    date_hierarchy = 'start_date'
    
    fieldsets = (
        ('Position Information', {
            'fields': ('company', 'position', 'employment_type', 'description')
        }),
        ('Duration', {
            'fields': ('start_date', 'end_date', 'current', 'duration')
        }),
        ('Details', {
            'fields': ('location', 'company_url', 'logo_url', 'technologies', 'achievements')
        }),
        ('Display', {
            'fields': ('order',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'proficiency_bar', 'proficiency_level', 'featured', 'years_experience']
    list_filter = ['category', 'featured', 'proficiency']
    search_fields = ['name']
    list_editable = ['proficiency', 'featured', 'years_experience']
    readonly_fields = ['id', 'proficiency_level', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Skill Information', {
            'fields': ('name', 'category', 'icon', 'years_experience')
        }),
        ('Proficiency', {
            'fields': ('proficiency', 'proficiency_level', 'featured')
        }),
        ('Display', {
            'fields': ('order',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def proficiency_bar(self, obj):
        """Display proficiency as a progress bar"""
        color = '#28a745' if obj.proficiency >= 75 else '#ffc107' if obj.proficiency >= 50 else '#dc3545'
        return format_html(
            '<div style="width: 100px; background-color: #e9ecef; border-radius: 4px;">'
            '<div style="width: {}%; height: 20px; background-color: {}; border-radius: 4px; '
            'text-align: center; line-height: 20px; color: white; font-size: 12px;">{}</div></div>',
            obj.proficiency, color, f"{obj.proficiency}%"
        )
    proficiency_bar.short_description = 'Proficiency'

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'version', 'active', 'file_size_formatted', 'created_at']
    list_filter = ['active', 'created_at']
    search_fields = ['file_name', 'version', 'description']
    list_editable = ['active']
    readonly_fields = ['id', 'file_size_formatted', 'created_at', 'updated_at']
    
    fieldsets = (
        ('File Information', {
            'fields': ('file_name', 'file_url', 'file_size', 'file_size_formatted')
        }),
        ('Version Control', {
            'fields': ('version', 'description', 'active')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )