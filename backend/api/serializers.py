from rest_framework import serializers

from .models import Recipe, Ingredient, Step
import time

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'recipe_id', 'ingredient_name', 'amount', 'measurement_type')

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ('id', 'recipe_id', 'info')

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, required=False)
    steps = StepSerializer(many=True, required=False)
    class Meta:
        model = Recipe
        fields = ['slug', 'recipe_name', 'last_edited', 'image_url', 'ingredients', 'steps']
