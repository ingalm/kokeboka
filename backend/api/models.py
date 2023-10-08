# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from django.utils.text import slugify
from autoslug import AutoSlugField


# Create your models here.

class Recipe(models.Model):
    recipe_name = models.CharField(max_length=30)
    last_edited = models.DateField('date published')
    image_url = models.CharField(max_length=100)
    slug = AutoSlugField(populate_from='recipe_name', unique=True, primary_key=True, always_update=True)

    def __str__ (self):
        return self.slug
    
class Ingredient(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    ingredient_name = models.CharField(max_length=20)
    amount = models.IntegerField()
    measurement_type = models.CharField(max_length=10)

    def __str__(self):
        return self.ingredient_name

class Step(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='steps', on_delete=models.CASCADE)
    info = models.CharField(max_length=200)

    def __str__(self):
        return self.info
