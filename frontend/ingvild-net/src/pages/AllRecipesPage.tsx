import React from 'react';
//import '../App.css';
import '../css/allRecipesPage.css';
import { useEffect, useState } from 'react';
import { Recipe } from '../services/types';
import RecipeService from '../services/recipeService';
import NavBar from '../components/NavBar';
import RecipeList from '../components/RecipeList';
import Footer from '../components/Footer';

function AllRecipesPage() {

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
   }, []);

  return (
    <div className="App">
      <NavBar></NavBar>
      <div id='filterDiv'>
        <p>Filtrering</p>
      </div>
      <div id='recipeList'>
        <RecipeList recipes={recipes}></RecipeList>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default AllRecipesPage;
