import React from 'react';
import '../App.css';
import '../css/mainPage.css';
import '../css/recipeList.css';
import RecipeCard from './RecipeCard';
import { Recipe } from '../services/types';

interface Props{
    recipes: Recipe[];
}

function RecipeList({recipes}: Props) {
    return (
        <div className="RecipeList">
            {recipes.map((currentRecipe, index) => (
            <RecipeCard 
                key={index} 
                slug={currentRecipe.slug}
                recipe_name={currentRecipe.recipe_name}
                img_url={currentRecipe.img_url}
            />
            ))}
        </div>
    );
}

export default RecipeList;
