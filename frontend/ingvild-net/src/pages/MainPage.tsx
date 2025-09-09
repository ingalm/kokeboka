import React, { useRef } from 'react';
import '../App.css';
import '../css/mainPage.css';
import { useEffect, useState } from 'react';
import { Recipe } from '../services/types';
import RecipeService from '../services/recipeService';
import NavBar from '../components/NavBar';
import RecipeList from '../components/RecipeList';
import Footer from '../components/Footer';
import { colors } from '@mui/material';

function MainPage() {

	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]); //Recipes that have been added recently
	const [recipeTips, setRecipeTips] = useState<Recipe[]>([]); //Random recipes to be shown on the main page

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

		console.log(recipes);
		setRecentRecipes(recipes.slice(0, 7)); //Show the three most recent recipes
		setRecipeTips(recipes.slice(3, 6)); //Show three random recipes, skal fikses så dette faktisk gjelder senere
	}, []);

	//Parallax effect for background

	const [translateY, setTranslateY] = useState(0); // Initialize translateY

	useEffect(() => {
		const parallaxBackground: HTMLElement|null = document.querySelector('#parallaxBackground');

		const handleScroll = () => {
			if (parallaxBackground) {
				const scrollY = window.scrollY;
				const newTranslateY = scrollY * 0.25; // Adjust the multiplier for the desired scroll speed

				// Smoothly update translateY
				setTranslateY(newTranslateY);
			}
			};

			window.addEventListener('scroll', handleScroll);

			return () => {
			// Remove the event listener when the component unmounts
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className="App">
			<NavBar></NavBar>
			<div id='parallaxBackground' style={{transform: `translateY(${translateY}px)`}}></div>
			<div id='recipePlanner'>
				<p>The weekly planner will be here</p>
			</div>
			<div id='recipeHighlights'>
				<h3>Highlights</h3>
				<RecipeList recipes={recipeTips}></RecipeList>
			</div>
			<div id='recentRecipes'>
				<h3>Nye oppskrifter</h3>
				<RecipeList recipes={recentRecipes}></RecipeList>
			</div>
			<Footer></Footer>
		</div>
	);
}

export default MainPage;
