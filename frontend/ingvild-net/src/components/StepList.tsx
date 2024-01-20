import React from 'react';
import '../App.css';
import StepComponent from './StepComponent';
import { Step } from '../services/types';
import ErrorResource from './ErrorResource';


interface Props{
    steps: Step[] | undefined;
}

function StepList({ steps }: Props){
    if(steps) {
        return (
            <div className='StepList'>
            {steps.map((currentStep, index) => (
                <StepComponent 
                    key={index}
                    type={currentStep.type}
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
