import React, { ChangeEvent } from 'react';
import '../App.css';
import "../css/recipeCreator.css"
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import IngredientField from '../components/recipeCreator/IngredientField';
import StepField from '../components/recipeCreator/StepField';
import RecipeService from '../services/recipeService';
import { Ingredient, Recipe, Step } from '../services/types';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';

function RecipeCreator() {

    const [recipe, setRecipe] = useState<Recipe>(
        {
            slug: "",
            recipe_name: "",
            last_edited: "",
            img_url: "",
            ingredient_list: [],
            step_list: [],
            est_time: undefined,
            oven_function: undefined
        }
    );
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        {
            ingredient_name: "",
            amount: undefined,
            measurement_type: undefined
        }
    ]);
    const [steps, setSteps] = useState<Step[]>([
        {
            type: 0,
            info: ""
        }
    ]);

    useEffect(() => {
        
      }, [recipe, ingredients, steps]);

    // Adds an IngredientField
    const addIngredient = () => {
        console.log("Added ingredient");

        // Create a new ingredient object with default values
        const newIngredient = {
            ingredient_name: "",
            amount: undefined,
            measurement_type: undefined
        };

        // Update the ingredients state with the new ingredient
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
    }

    // Adds a StepField
    const addStep = () => {
        console.log("Added step");

        // Create a new ingredient object with default values
        const newStep = {
            type: 0,
            info: ""
        };

        // Update the ingredients state with the new ingredient
        setSteps(prevSteps => [...prevSteps, newStep]);
    }

    // Removes an IngredientField
    const removeIngredient = (index: number) => {
        console.log("Removed ingredient at index", index);

        // Create a copy of the current ingredients list
        const updatedIngredients = [...ingredients];

        // Remove the ingredient at the specified index
        updatedIngredients.splice(index, 1);

        // Update the ingredients state with the modified list
        setIngredients(updatedIngredients);
    };

    // Removes a StepField
    const removeStep = (index: number) => {
        console.log("Removed step at index", index);

        // Create a copy of the current steps list
        const updatedSteps = [...steps];

        // Remove the steps at the specified index
        updatedSteps.splice(index, 1);

        // Update the steps state with the modified list
        setSteps(updatedSteps);
    };

    // Changes the values of an ingredient in the ingredient list
    const changeIngredient = (index: number, field: string, value: string | number) => {
        setIngredients((prevIngredients) => {
            return prevIngredients.map((ingredient, i) => {
                if (i === index) {
                    return {
                        ...ingredient,
                        [field]: value,
                    };
                }
                return ingredient;
            });
        });
    }

    // Changes the values of a step in the step list
    const changeStep = (index: number, field: string, value: string | number) => {
        setSteps((prevSteps) => {
            return prevSteps.map((step, i) => {
                if (i === index) {
                    return {
                        ...step,
                        [field]: value,
                    };
                }
                return step;
            });
        });
    }

    // Changes all non-list fields of the recipe based on field variable
    const changeRecipe = (field: string) => (event: ChangeEvent<HTMLInputElement>) => {
        setRecipe((prevRecipe) => {
            if(field === "hours" || field === "minutes") { // If the field is hours or minutes, update the est_time object
                return {
                    ...prevRecipe,
                    est_time: {
                        ...prevRecipe.est_time,
                        [field]: event.target.value,
                    }
                };
            }
            else if(field === "degrees" || field === "function_name") { // If the field is degrees or function_name, update the oven_function object
                return {
                    ...prevRecipe,
                    oven_function: {
                        ...prevRecipe.oven_function,
                        [field]: event.target.value,
                    }
                };
            }
            return { // Otherwise, update the main recipe object
                ...prevRecipe,
                [field]: event.target.value,
            };
        });
    };

    // Pushes the recipe to the database
    const publishRecipe = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const currentDate = new Date().toISOString().split('T')[0];
    
        console.log("Publishing recipe (before):", recipe);
        // Update the recipe with the latest ingredient and step lists
        const updatedRecipe = {
            ...recipe,
            ingredient_list: ingredients,
            step_list: steps,
            last_edited: currentDate,
        };

        console.log("Publishing recipe:", updatedRecipe);

        RecipeService.CreateRecipe(updatedRecipe);
    }

    return (
        <div className="App">
            <Link id='title' to={"/"}><h1>Kokeboka</h1></Link>
            <h3>Oppskriftlager</h3>
            <form action="submit" onSubmit={publishRecipe}>
                <div id='mainInfoDiv'>
                    <TextField label='Recipe name' onChange={changeRecipe("recipe_name")} variant='outlined' required></TextField>
                    <TextField label='Image Url' onChange={changeRecipe("img_url")} variant='outlined' required></TextField>
                </div>
                <div>
                    <TextField label='Estimated hours' onChange={changeRecipe("hours")} type='number'></TextField>
                    <TextField label='Estimated minutes' onChange={changeRecipe("minutes")} type='number'></TextField>
                </div>
                <div>
                    <TextField label='Degrees' onChange={changeRecipe("degrees")} type='number'></TextField>
                    <TextField label='Oven function' onChange={changeRecipe("function_name")}></TextField>
                </div>
                <div id='ingredientsAndStepsContainer'>
                    <div id='ingredientDiv'>
                        <div id='ingredientList'>
                            {ingredients.map((currentIngredient, index) => (
                                <IngredientField 
                                    key={index}
                                    index={index}
                                    ingredientName={currentIngredient.ingredient_name}
                                    amount={currentIngredient.amount}
                                    measurementType={currentIngredient.measurement_type}
                                    onRemove = {() => removeIngredient(index)}
                                    onChange = {changeIngredient}
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
                            {steps.map((currentStep, index) => (
                                <StepField
                                key={index}
                                index={index}
                                type={currentStep.type}
                                info={currentStep.info}
                                onRemove = {() => removeStep(index)}
                                onChange = {changeStep}
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
