import React from 'react';
import '../App.css';
import { Step } from '../services/types';

function IngredientComponent({type, info}: Step){

    return (
        <div className="IngredientComponent">
            <p>{type}</p>
            <p>{info}</p>
        </div>
    );

}

export default IngredientComponent;
