import React from 'react';
import '../App.css';
import { useEffect, useState } from 'react';
import { Recipe } from '../services/recipeService';
import RecipeService from '../services/recipeService';
import NavBar from '../components/NavBar';
import RecipeList from '../components/RecipeList';

function MainPage() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  const Update = () => {
    RecipeService.GetRecipes()
      .then((response) => {
        setRecipes(response);
        console.log(recipes);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    Update();
  });

  return (
    <div className="App">
      <NavBar></NavBar>
      <RecipeList recipes={recipes}></RecipeList>
    </div>
  );
}

export default MainPage;
