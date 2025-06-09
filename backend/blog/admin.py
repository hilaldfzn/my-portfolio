from django.contrib import admin
from django.utils.html import format_html
from .models import Article

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'published', 'featured', 'view_count', 'read_time', 'created_at']
    list_filter = ['published', 'featured', 'created_at', 'tags']
    search_fields = ['title', 'excerpt', 'content']
    list_editable = ['published', 'featured']
    readonly_fields = ['id', 'slug', 'view_count', 'created_at', 'updated_at']
    prepopulated_fields = {'slug': ('title',)}
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'image_url')
        }),
        ('Publication', {
            'fields': ('published', 'featured', 'tags')
        }),
        ('SEO', {
            'fields': ('meta_description', 'meta_keywords'),
            'classes': ('collapse',)
        }),
        ('Analytics', {
            'fields': ('read_time', 'view_count'),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).order_by('-created_at')