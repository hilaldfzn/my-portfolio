from django.db import models
from django.utils.text import slugify
from apps.core.models import TimeStampedModel
from apps.core.utils import generate_unique_slug
import markdown
from django.utils.html import strip_tags

class Article(TimeStampedModel):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    excerpt = models.TextField(help_text="Brief description of the article")
    content = models.TextField(help_text="Article content in Markdown format")
    image_url = models.URLField(max_length=500, blank=True, help_text="Featured image URL")
    published = models.BooleanField(default=False, help_text="Make article visible to public")
    tags = models.JSONField(default=list, help_text="List of tags")
    read_time = models.PositiveIntegerField(default=5, help_text="Estimated read time in minutes")
    
    # SEO fields
    meta_description = models.CharField(max_length=160, blank=True, help_text="SEO meta description")
    meta_keywords = models.CharField(max_length=255, blank=True, help_text="SEO keywords")
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False, help_text="Feature on homepage")

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Article, self.title)
        
        # Auto-generate meta description if not provided
        if not self.meta_description and self.excerpt:
            self.meta_description = self.excerpt[:160]
        
        # Calculate read time based on content
        if self.content:
            word_count = len(self.content.split())
            self.read_time = max(1, round(word_count / 200))  # Average reading speed
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    @property
    def content_html(self):
        """Convert markdown content to HTML"""
        return markdown.markdown(self.content, extensions=['codehilite', 'fenced_code'])

    @property
    def excerpt_text(self):
        """Get plain text excerpt"""
        return strip_tags(self.excerpt)

    def increment_view_count(self):
        """Increment view count"""
        self.view_count += 1
        self.save(update_fields=['view_count'])