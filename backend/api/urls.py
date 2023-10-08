from django.urls import path, include
from rest_framework import routers

from api import views
from .views import *

# define the router
router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('recipes/create/', CreateRecipe.as_view(), name='create-recipe'),
    path('recipes/<slug:recipe_id>/', GetRecipe.as_view(), name='get-recipe'),
    path('recipes/', ListRecipes.as_view(), name='list-recipes'),
    path('recipes/<slug:recipe_id>/add_ingredient/', views.AddIngredientToRecipe.as_view(), name='add-ingredient-to-recipe'),
    path('recipes/<slug:recipe_id>/add_step/', views.AddStepToRecipe.as_view(), name='add-step-to-recipe'),

]