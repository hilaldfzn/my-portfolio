from django.utils.text import slugify
import string
import random

def generate_unique_slug(model_class, title, slug_field='slug'):
    """Generate a unique slug for a model instance."""
    base_slug = slugify(title)
    unique_slug = base_slug
    num = 1
    
    while model_class.objects.filter(**{slug_field: unique_slug}).exists():
        unique_slug = f'{base_slug}-{num}'
        num += 1
    
    return unique_slug

def generate_random_string(length=8):
    """Generate a random string of specified length."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))