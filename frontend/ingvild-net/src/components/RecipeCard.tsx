import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

interface RecipeCardInterface {
    slug: string;
    recipe_name: string;
    img_url: string;
}

function RecipeCard({
    slug, 
    recipe_name, 
    img_url}: RecipeCardInterface) {
    return (
        <div className="RecipeCard">
            <Link to={`/recipes/${slug}`}>
                <img src={img_url} alt=''/>
                <p>{recipe_name}</p>
            </Link>
        </div>
    );
}

export default RecipeCard;
