import React from 'react';
import '../App.css';
import IngredientComponent from './IngredientComponent';
import { Ingredient } from '../services/recipeService';
import ErrorResource from './ErrorResource';


interface Props{
    ingredients: Ingredient[] | undefined;
}

function IngredientList({ ingredients }: Props){
    if(ingredients) {
        return (
            <div className='IngredientList'>
            {ingredients.map((currentIngredient) => (
                <IngredientComponent 
                    id={0}
                    recipe_id={currentIngredient.recipe_id}
                    slug=''
                    ingredient_name={currentIngredient.ingredient_name} 
                    amount={currentIngredient.amount} 
                    measurement_type={currentIngredient.measurement_type} />
            ))}
            </div>
        );
    }
    else {
        return(
            <div>
                <ErrorResource></ErrorResource>
            </div>
        )
    }
}

export default IngredientList;
