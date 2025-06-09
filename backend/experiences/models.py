from django.db import models
from apps.core.models import TimeStampedModel

class Experience(TimeStampedModel):
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    current = models.BooleanField(default=False, help_text="Currently working here")
    location = models.CharField(max_length=100, blank=True)
    company_url = models.URLField(max_length=500, blank=True)
    logo_url = models.URLField(max_length=500, blank=True)
    technologies = models.JSONField(default=list, help_text="Technologies used in this role")
    
    # Additional fields
    employment_type = models.CharField(
        max_length=50, 
        choices=[
            ('full_time', 'Full Time'),
            ('part_time', 'Part Time'),
            ('contract', 'Contract'),
            ('freelance', 'Freelance'),
            ('internship', 'Internship'),
        ],
        default='full_time'
    )
    achievements = models.JSONField(default=list, help_text="Key achievements in this role")
    order = models.IntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ['-current', '-start_date', 'order']
        verbose_name = 'Experience'
        verbose_name_plural = 'Experiences'

    def save(self, *args, **kwargs):
        # If current is True, ensure end_date is None
        if self.current:
            self.end_date = None
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.position} at {self.company}"

    @property
    def duration(self):
        """Calculate duration of employment"""
        from datetime import date
        from dateutil.relativedelta import relativedelta
        
        end = self.end_date or date.today()
        delta = relativedelta(end, self.start_date)
        
        years = delta.years
        months = delta.months
        
        if years and months:
            return f"{years} year{'s' if years > 1 else ''}, {months} month{'s' if months > 1 else ''}"
        elif years:
            return f"{years} year{'s' if years > 1 else ''}"
        elif months:
            return f"{months} month{'s' if months > 1 else ''}"
        else:
            return "Less than a month"

class Skill(TimeStampedModel):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('database', 'Database'),
        ('tools', 'Tools & DevOps'),
        ('mobile', 'Mobile'),
        ('design', 'Design'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    proficiency = models.PositiveIntegerField(
        default=80, 
        help_text="Proficiency level (1-100)"
    )
    icon = models.CharField(max_length=50, blank=True, help_text="Icon class or name")
    years_experience = models.FloatField(null=True, blank=True, help_text="Years of experience")
    featured = models.BooleanField(default=False, help_text="Show prominently")
    order = models.IntegerField(default=0, help_text="Display order within category")

    class Meta:
        ordering = ['category', 'order', 'name']
        unique_together = ['name', 'category']
        verbose_name = 'Skill'
        verbose_name_plural = 'Skills'

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    @property
    def proficiency_level(self):
        """Return proficiency as a level"""
        if self.proficiency >= 90:
            return "Expert"
        elif self.proficiency >= 75:
            return "Advanced"
        elif self.proficiency >= 50:
            return "Intermediate"
        else:
            return "Beginner"

class Resume(TimeStampedModel):
    file_url = models.URLField(max_length=500, help_text="Direct download URL")
    file_name = models.CharField(max_length=200)
    file_size = models.PositiveIntegerField(null=True, blank=True, help_text="File size in bytes")
    active = models.BooleanField(default=True, help_text="Current active resume")
    version = models.CharField(max_length=20, blank=True, help_text="Version number")
    description = models.TextField(blank=True, help_text="Description or notes")

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Resume'
        verbose_name_plural = 'Resumes'

    def save(self, *args, **kwargs):
        # Ensure only one active resume
        if self.active:
            Resume.objects.filter(active=True).update(active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.file_name} ({self.version})" if self.version else self.file_name

    @property
    def file_size_formatted(self):
        """Return formatted file size"""
        if not self.file_size:
            return "Unknown"
        
        for unit in ['B', 'KB', 'MB', 'GB']:
            if self.file_size < 1024.0:
                return f"{self.file_size:.1f} {unit}"
            self.file_size /= 1024.0
        return f"{self.file_size:.1f} TB"