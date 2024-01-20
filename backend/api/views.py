# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import viewsets

# Create your views here.
from django.http import HttpResponse
from .models import Recipe
from .serializers import RecipeSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'slug' # This is the field that will be used for the lookup in the URL