from django.contrib import admin
from .models import Project

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'featured', 'order', 'created_at']
    list_filter = ['status', 'featured', 'created_at', 'technologies']
    search_fields = ['title', 'description', 'client']
    list_editable = ['featured', 'status', 'order']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'long_description', 'image_url')
        }),
        ('Links', {
            'fields': ('demo_url', 'github_url')
        }),
        ('Technical Details', {
            'fields': ('technologies', 'status')
        }),
        ('Project Management', {
            'fields': ('featured', 'order', 'start_date', 'end_date', 'client', 'team_size')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-featured', 'order', '-created_at')