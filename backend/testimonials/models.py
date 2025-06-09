from django.db import models
from apps.core.models import TimeStampedModel

class Testimonial(TimeStampedModel):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]
    
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True, help_text="Job title or role")
    company = models.CharField(max_length=100, blank=True, help_text="Company or organization")
    content = models.TextField(help_text="Testimonial content")
    avatar_url = models.URLField(max_length=500, blank=True, help_text="Profile picture URL")
    rating = models.PositiveIntegerField(choices=RATING_CHOICES, default=5)
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    
    # Additional fields
    project_related = models.CharField(max_length=200, blank=True, help_text="Related project or service")
    linkedin_url = models.URLField(max_length=500, blank=True)
    approved = models.BooleanField(default=True, help_text="Approved for display")
    order = models.IntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ['-featured', 'order', '-created_at']
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'

    def __str__(self):
        return f"{self.name} - {self.company}" if self.company else self.name

    @property
    def star_rating(self):
        """Return star representation of rating"""
        return "⭐" * self.rating

    @property
    def short_content(self):
        """Return shortened content for list views"""
        return self.content[:100] + "..." if len(self.content) > 100 else self.content