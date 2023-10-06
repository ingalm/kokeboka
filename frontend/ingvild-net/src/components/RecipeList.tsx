import React from 'react';
import '../App.css';
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
            id={currentRecipe.id}
            recipe_name={currentRecipe.recipe_name}
            img_url={currentRecipe.image_url}
            />
            ))}
        </div>
    );
}

export default RecipeList;
