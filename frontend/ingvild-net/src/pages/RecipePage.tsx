import '../App.css';
import { useState, useEffect } from 'react';
import RecipeService from '../services/recipeService';
import { Recipe } from '../services/types';
import { useParams } from "react-router-dom";
import NavBar from '../components/NavBar';
import IngredientList from '../components/IngredientList';
import StepList from '../components/StepList';
import ErrorResource from '../components/ErrorResource';

function RecipePage() {
  
  const { id } = useParams(); //The id of the recipe to be fetched

  const [recipe, setRecipe] = useState<Recipe>(); //Recipe information to be shown on page
  
  const Update = (id:any) => {
    if (id) { //If id is not null, get the recipe
      RecipeService.GetRecipe(id)
        .then((response) => {
          setRecipe(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    Update(id);
  });

  if(recipe) {
		return (
			<div className="App">
				<NavBar></NavBar>
				<IngredientList ingredients={recipe?.ingredient_list}></IngredientList>
				<StepList steps={recipe?.step_list}></StepList>
			</div>
		);
    }
    else {
		return(
			<div className='App'>
				<NavBar></NavBar>
				<ErrorResource></ErrorResource>
			</div>
		)
    }
}

export default RecipePage;
