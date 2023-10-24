import React from 'react';
import '../App.css';
import '../css/mainPage.css';
import '../css/recipeList.css';
import RecipeCard from './RecipeCard';
import { Recipe } from '../services/recipeService';

interface Props{
    recipes: Recipe[];
}

function RecipeList({recipes}: Props) {
    return (
        <div className="RecipeList">
            {recipes.map((currentRecipe) => (
            <RecipeCard key={currentRecipe.id} 
            slug={currentRecipe.slug}
            recipe_name={currentRecipe.recipe_name}
            img_url={currentRecipe.image_url}
            />
            ))}
        </div>
    );
}

export default RecipeList;
