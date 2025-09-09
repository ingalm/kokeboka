import React, { ChangeEvent } from 'react';
import '../App.css';
import "../css/recipeCreator.css"
import Button from '../components/Button';
import { useState, useEffect } from 'react';
import IngredientField from '../components/recipeCreator/IngredientField';
import StepField from '../components/recipeCreator/StepField';
import RecipeService from '../services/recipeService';
import { Ingredient, Recipe, Step, timeEstimations, ovenFunctionNames } from '../services/types';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import DropDown from '../components/DropDown';

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
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);

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
    const changeRecipe = (field: string, value?: string | number) => (event: ChangeEvent<HTMLInputElement>) => {
        console.log("Changing recipe:", field, event.target.value);
        setRecipe((prevRecipe) => {
            if(!value) value = event.target.value; // If value is not specified, use the event target value

            console.log(value);
            if(field === "degrees" || field === "function_name") { // If the field is degrees or function_name, update the oven_function object
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
                [field]: value,
            };
        });
        console.log("Recipe:", recipe);
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
    };

    const handleDropdownChange = (field: string, value: string) => {
        if(field === "est_time") {
            setRecipe((prevRecipe) => ({
                ...prevRecipe,
                [field]: value,
            }));
        }
        else if(field === "oven_function") {
            setRecipe((prevRecipe) => {
                return {
                    ...prevRecipe,
                    oven_function: {
                        ...prevRecipe.oven_function,
                        [field]: value,
                    }
                };
            });
        }
        else { //Error handling
            console.log("Invalid field:", field);
        }

        console.log("Recipe:", recipe);
    };

    // State to hold the style
    const [isOvenFunctionActive, setOvenFunctionActive] = useState(false);

    // Dynamic style based on isActive
    const ovenFunctionStyle: React.CSSProperties = {
        display: isOvenFunctionActive ? 'inline-block' : 'none',

      };
    // Dynamic button text based on isActive
    const ovenFunctionButtonChild = isOvenFunctionActive ? "Remove oven function" : "Add oven function";

    const handleOvenFunctionButton = () => {

        setOvenFunctionActive(!isOvenFunctionActive);

        setRecipe((prevRecipe) => {
            return {
                ...prevRecipe,
                oven_function: {
                    function_name: "0",
                    degrees: undefined,
                }
            };
        });
    };

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
                    <label htmlFor="">Estimated time: </label>
                    <DropDown 
                    field={'est_time'} 
                    options={timeEstimations} 
                    onChange={handleDropdownChange}
                    ></DropDown>
                </div>
                <div style={ovenFunctionStyle}>
                    <TextField label='Degrees' onChange={changeRecipe("degrees")} type='number'></TextField>
                    <DropDown 
                    field={'oven_function'} 
                    options={ovenFunctionNames} 
                    onChange={handleDropdownChange}
                    ></DropDown>
                </div>
                <Button
                    classnames='addingButton'
                    type='button'
                    children={ovenFunctionButtonChild}
                    onClick={handleOvenFunctionButton}
                ></Button>
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
