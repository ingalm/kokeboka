import React from 'react';
import '../App.css';
import StepComponent from './StepComponent';
import { Step } from '../services/recipeService';
import ErrorResource from './ErrorResource';


interface Props{
    steps: Step[] | undefined;
}

function StepList({ steps }: Props){
    if(steps) {
        return (
            <div className='StepList'>
            {steps.map((currentStep) => (
                <StepComponent 
                    id={0}
                    recipe_id={currentStep.recipe_id}
                    slug={currentStep.slug}
                    info={currentStep.info}/>
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

export default StepList;
