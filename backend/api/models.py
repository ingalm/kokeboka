# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string

# Create your models here.

class Recipe(models.Model):
    recipe_name = models.CharField(max_length=30)
    last_edited = models.DateField('date published')
    image_url = models.CharField(max_length=100)

    def __str__ (self):
        return self.recipe_name
    
    @classmethod
    def create(cls, recipe_data):
        # Create the recipe instance
        recipe = cls(recipe_name=recipe_data['recipe_name'], last_edited=recipe_data['last_edited'],
                     image_url=recipe_data['image_url'])
        recipe.save()

        # Create and save the associated ingredients
        """for ingredient_data in recipe_data['ingredients']:
            ingredient = Ingredient(recipe_id=recipe, ingredient_name=ingredient_data['ingredient_name'],
                                    amount=ingredient_data['amount'], measurement_type=ingredient_data['measurement_type'])
            slug = slugify(ingredient.ingredient_name)
            # Check if the generated slug already exists
            while Ingredient.objects.filter(slug=slug).exists():
                # Append a random string to make the slug unique
                slug = f"{slug}-{get_random_string(length=1)}"
            ingredient.slug = slug
            ingredient.save()

        # Create and save the associated steps
        for step_data in recipe_data['steps']:
            step = Step(recipe_id=recipe, info=step_data['info'])
            slug = slugify(step.info)
            # Check if the generated slug already exists
            while Step.objects.filter(slug=slug).exists():
                # Append a random string to make the slug unique
                slug = f"{slug}-{get_random_string(length=1)}"
            step.slug = slug
            step.save()

        return recipe"""

class Ingredient(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='ingredients', on_delete=models.CASCADE)
    ingredient_name = models.CharField(max_length=20)
    amount = models.IntegerField()
    measurement_type = models.CharField(max_length=10)
    slug = models.SlugField(unique=True)

    @classmethod
    def create(cls, recipe_id, ingredient_data):
        ingredient = cls(recipe_id=recipe_id, **ingredient_data)
        
        # Generate the slug based on the ingredient name
        slug = slugify(ingredient.ingredient_name)
        # Check if the generated slug already exists
        while Ingredient.objects.filter(slug=slug).exists():
            # Append a random string to make the slug unique
            slug = f"{slug}-{get_random_string(length=1)}"
        ingredient.slug = slug

        ingredient.save()

    def __str__(self):
        return self.ingredient_name

class Step(models.Model):
    recipe_id = models.ForeignKey(Recipe, related_name='steps', on_delete=models.CASCADE)
    info = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    @classmethod
    def create(cls, recipe_id, step_data):
        step = cls(recipe_id=recipe_id, **step_data)
        
        # Generate the slug based on the ingredient name
        slug = slugify(step.info)
        # Check if the generated slug already exists
        while Ingredient.objects.filter(slug=slug).exists():
            # Append a random string to make the slug unique
            slug = f"{slug}-{get_random_string(length=1)}"
        step.slug = slug

        step.save()

    def __str__(self):
        return self.info
