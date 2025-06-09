from django.db import models
from apps.core.models import TimeStampedModel

class Project(TimeStampedModel):
    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('in_progress', 'In Progress'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    long_description = models.TextField(blank=True, help_text="Detailed description for project page")
    image_url = models.URLField(max_length=500, blank=True, help_text="Main project image")
    demo_url = models.URLField(max_length=500, blank=True, help_text="Live demo URL")
    github_url = models.URLField(max_length=500, blank=True, help_text="GitHub repository URL")
    technologies = models.JSONField(default=list, help_text="List of technologies used")
    featured = models.BooleanField(default=False, help_text="Show on homepage")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='completed')
    order = models.IntegerField(default=0, help_text="Display order (lower numbers first)")
    
    # Additional fields for better project management
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    client = models.CharField(max_length=100, blank=True)
    team_size = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['-featured', 'order', '-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def __str__(self):
        return self.title

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def technology_count(self):
        return len(self.technologies) if self.technologies else 0