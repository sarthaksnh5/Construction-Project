from django.db import models

# Create your models here.
class QueryTable(models.Model):
    name = models.CharField(max_length=255, blank=False)
    email = models.EmailField(blank=False)
    mobile = models.CharField(max_length=10, blank=False)
    services = models.CharField(max_length=255, blank=True)
    message = models.TextField()