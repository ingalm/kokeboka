# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.shortcuts import render

# Create your views here.

from django.http import JsonResponse
import json
from django.http import HttpResponse
from .models import Recipe
from .serializers import RecipeSerializer, IngredientSerializer, StepSerializer
from rest_framework import status


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class CreateRecipe(APIView):
    def post(self, request):
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetRecipe(APIView):
    def get(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(slug=recipe_id)
        except Recipe.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = RecipeSerializer(recipe)
        return Response(serializer.data)

class ListRecipes(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class AddIngredientToRecipe(APIView):
    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(slug=recipe_id)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = IngredientSerializer(data=request.data)
        if serializer.is_valid():
            ingredient = serializer.save(recipe_id=recipe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AddStepToRecipe(APIView):
    def post(self, request, recipe_id):
        try:
            recipe = Recipe.objects.get(slug=recipe_id)
        except Recipe.DoesNotExist:
            return Response({"error": "Recipe not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = StepSerializer(data=request.data)
        if serializer.is_valid():
            step = serializer.save(recipe_id=recipe)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)