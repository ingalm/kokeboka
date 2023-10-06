from rest_framework import serializers

from .models import Recipe, Ingredient, Step
import time

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ('id', 'recipe_id', 'slug','ingredient_name', 'amount', 'measurement_type')

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ('id', 'recipe_id', 'slug', 'info')

class RecipeSerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True)
    steps = StepSerializer(many=True)
    class Meta:
        model = Recipe
        fields = ('id', 'recipe_name', 'last_edited', 'image_url', 'ingredients', 'steps')

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')

        recipe = Recipe.objects.create(**validated_data)

        for ingredient_data in ingredients_data:
            Ingredient.objects.create(recipe, **ingredient_data)

        for step_data in steps_data:
            Step.objects.create(recipe, **step_data)

        return recipe
