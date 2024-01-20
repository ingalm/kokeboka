import React from 'react';
import '../App.css';
import { useState, useEffect } from 'react';
import RecipeService from '../services/recipeService';
import { Recipe } from '../services/types';
import NavBar from '../components/NavBar';

function SearchPage() {

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  
  const Update = () => {
    RecipeService.GetRecipes()
      .then((response) => {
        setRecipes(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    Update();
  });

  console.log(recipes);
  return (
    <div className="App">
      <NavBar></NavBar>
    </div>
  );
}

export default SearchPage;
