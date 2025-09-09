from __future__ import unicode_literals
from django.db import models
from autoslug import AutoSlugField


class Recipe(models.Model):
    recipe_name = models.CharField(max_length=30)
    last_edited = models.DateField()
    img_url = models.CharField(max_length=200)
    est_time = models.CharField(max_length=30, default='0') # Optional

    #Lists
    ingredient_list = models.JSONField()  # Storing ingredients as JSON
    step_list = models.JSONField()  # Storing steps as JSON
    oven_function = models.JSONField(blank=True, default=0) # Optional

    #Creation of slug
    slug = AutoSlugField(populate_from='recipe_name', unique=True, primary_key=True, always_update=True)

    def __str__ (self):
        return self.slug
    
