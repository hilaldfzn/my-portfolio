from django.urls import path
from .views import home_data, contact_form

urlpatterns = [
    path('home/', home_data, name='home_data'),
    path('contact/', contact_form, name='contact_form'),
]