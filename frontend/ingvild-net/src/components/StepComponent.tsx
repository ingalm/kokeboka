import React from 'react';
import '../App.css';
import { Step } from '../services/recipeService';

function IngredientComponent({
    info}: Step){

    return (
        <div className="IngredientComponent">
            <p>{info}</p>
        </div>
    );

}

export default IngredientComponent;
