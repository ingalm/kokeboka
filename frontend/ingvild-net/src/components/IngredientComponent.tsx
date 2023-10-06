import React from 'react';
import '../App.css';
import { Ingredient } from '../services/recipeService';

function IngredientComponent({
    ingredient_name, 
    amount, 
    measurement_type}: Ingredient){

    return (
        <div className="IngredientComponent">
            <p>{ingredient_name}</p>
            <p>{amount}</p>
            <p>{measurement_type}</p>
        </div>
    );

}

export default IngredientComponent;
