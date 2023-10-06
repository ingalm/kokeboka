import React, { ChangeEvent } from 'react';
import '../App.css';
import "../css/recipeCreator.css"
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import NewIngredient from '../components/recipeCreator/NewIngredient';
import NewStep from '../components/recipeCreator/NewStep';
import RecipeService, { Recipe, Step, Ingredient } from '../services/recipeService';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

function RecipeCreator() {

    const [steps, setSteps] = useState<Step[]>([
        
    ]);
    const [stepCounter, setStepCounter] = useState(1);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientCounter, setIngredientCounter] = useState(1);
    const [imgUrl, setImgUrl] = useState("");
    const [recipeName, setRecipeName] = useState("");

    const addIngredient = () => {
        console.log("Added ingredient");
        const newIngredient = {
            id: ingredientCounter,
            recipe_id: 0,
            slug: "placeholder",
            ingredient_name: "",
            amount: 0,
            measurement_type: ""};
        setIngredients((ingredients) => [...ingredients, newIngredient]);
        setIngredientCounter((ingredientCounter) => ingredientCounter + 1);
    }

    

    const addStep = () => {
        console.log("Added step");
        const newStep = {
            id: stepCounter,
            recipe_id: 0,
            slug: "placeholder",
            info: ""
            };
        setSteps((steps) => [...steps, newStep]);
        setStepCounter((stepCounter) => stepCounter + 1);
    }

    

    //Add the three first empty ingredients and steps
    useEffect(() => {
        for (let i = 0; i < 1; i++) {
            addIngredient();
            addStep();
        }
    }, []);

    const removeIngredient = (id: number) => {
        setIngredients((ingredients) => ingredients.filter((component) => component.id !== id));
    };

    const removeStep = (id: number) => {
        setSteps((steps) => steps.filter((component) => component.id !== id));
    };

    const changeIngredient = (id: number, newName: string, newAmount: number, newMeasurementType: string) => {
        setIngredients((ingredients) =>
            ingredients.map((currentIngredient) => {
                if (currentIngredient.id === id) {
                    // Return a new object with updated name
                    return { ...currentIngredient,  ingredient_name: newName, amount: newAmount, measurement_type: newMeasurementType };
                }
                // No update needed for other items
                return currentIngredient;
            })
        );
    }

    const changeStep = (id: number, newInfo: string) => {
        setSteps((steps) =>
            steps.map((currentStep) => {
                if (currentStep.id === id) {
                    // Return a new object with updated name
                    return { ...currentStep,  info: newInfo };
                }
                // No update needed for other items
                return currentStep;
            })
        );
    }

    const changeRecipe = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
        if(field === "recipeName") {
            setRecipeName(event.target.value);
        } 
        else if (field === "imgUrl") {
            setImgUrl(event.target.value);
        }
    }

    const publishRecipe = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const recipeData: Recipe = {
            id: 0,  
            recipe_name: recipeName, 
            last_edited: new Date().toISOString().split('T')[0],  
            image_url: imgUrl, 
            ingredients: ingredients, 
            steps: steps};

        console.log(recipeData);

        RecipeService.CreateRecipe(recipeData);
    }

    useEffect(() => {
        //Oppdater oppskriften som skal publiseres
      }, [ingredients, recipeName, imgUrl, steps]);

    return (
        <div className="App">
            <Link id='title' to={"/"}><h1>Kokeboka</h1></Link>
            <h3>Oppskriftlager</h3>
            <form action="submit" onSubmit={publishRecipe}>
                <div id='mainInfoDiv'>
                    <TextField label='Recipe name' onChange={changeRecipe("recipeName")} variant='outlined'></TextField>
                    <TextField label='Image Url' onChange={changeRecipe("imgUrl")} variant='outlined'></TextField>
                </div>
                <div id='ingredientsAndStepsContainer'>
                    <div id='ingredientDiv'>
                        <div id='ingredientList'>
                            {ingredients.map((currentIngredient) => (
                                <NewIngredient 
                                    key={currentIngredient.id}
                                    id={currentIngredient.id}
                                    ingredientName={currentIngredient.ingredient_name}
                                    amount={currentIngredient.amount}
                                    measurementType={currentIngredient.measurement_type}
                                    onRemove={removeIngredient}
                                    onChange={changeIngredient}
                                />
                            ))}
                        </div>
                        <Button 
                        type='button'
                        classnames='block addingButton'
                        children={"Add Ingredient"}
                        onClick={addIngredient}
                        ></Button>
                    </div>
                    <div id='stepDiv'>
                        <div id='stepList'>
                            {steps.map((currentStep) => (
                                <NewStep
                                key={currentStep.id}
                                id={currentStep.id}
                                info={currentStep.info}
                                onRemove={removeStep}
                                onChange={changeStep}
                            />
                            ))}
                        </div>
                        <Button 
                        type='button'
                        classnames="block addingButton"
                        children={"Add step"}
                        onClick={addStep}
                        ></Button>
                    </div>
                </div>
                <Button 
                    type='submit'
                    id='submitRecipeButton'
                    children={"Publish recipe"}
                ></Button>
                
            </form>
        </div>
    );
}

export default RecipeCreator;
