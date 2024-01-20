from rest_framework import serializers

from .models import Recipe
import time

class RecipeSerializer(serializers.ModelSerializer):
    #est_time = serializers.DictField(default={'hours': 0, 'minutes': 0})

    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('slug',)  # Make sure 'slug' is read-only
