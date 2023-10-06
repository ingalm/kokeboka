import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

interface RecipeCardInterface {
    id: number;
    recipe_name: string;
    img_url: string;
}

function RecipeCard({
    id, 
    recipe_name, 
    img_url}: RecipeCardInterface) {
    return (
        <div className="RecipeCard">
            <Link to={`/recipes/${id}`}>
                <img src={img_url} alt=''/>
                <p>{recipe_name}</p>
            </Link>
        </div>
    );
}

export default RecipeCard;
