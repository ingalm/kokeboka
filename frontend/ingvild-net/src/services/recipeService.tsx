import { AxiosResponse } from 'axios';
import api from './api';

export interface Recipe {
    id: number;
    recipe_name: string;
    last_edited: string;
    image_url: string;
    ingredients: Ingredient[];
    steps: Step[];
}

export interface RecipeData {
    recipe_name: string;
    last_edited: string;
    image_url: string;
}

export interface Ingredient {
    id: number;
    recipe_id: string;
    ingredient_name: string;
    amount: number;
    slug: string;
    measurement_type: string;
}

export interface Step {
    id: number
    recipe_id: string;
    slug: string;
    info: string;
}

const CreateRecipe = (recipeData: RecipeData, ingredients: Ingredient[], steps: Step[]): 
    Promise<{ success: boolean; recipeId: any; } | { success: boolean; error: any; }> => {
    
        return api.post('/recipes/create/', recipeData)
        .then(response => {
            const recipeId = response.data.slug;
            console.log("Recipe created with ID:", recipeId);


            // Add recipe id to all ingredients and steps
            for (let i = 0; i < ingredients.length; i++) {
                ingredients[i].recipe_id = recipeId;
            }

            for (let i = 0; i < steps.length; i++) {
                steps[i].recipe_id = recipeId;
            }

            // Use Promise.all to ensure all ingredients and steps are added before final response
            const ingredientPromises = ingredients.map(ingredient => 
                api.post(`/recipes/${recipeId}/add_ingredient/`, ingredient)
            );

            const stepPromises = steps.map(step => 
                api.post(`/recipes/${recipeId}/add_step/`, step)
            );

            return Promise.all([...ingredientPromises, ...stepPromises])
                .then(() => {
                    return {
                        success: true,
                        recipeId: recipeId
                    };
                });
        })
        .catch(error => {
            console.error("Error creating recipe:", error);
            return {
                success: false,
                error: error
            };
        });
};

const GetRecipe = (id: string): Promise<Recipe>  => {
    const request = api.get(`/recipes/${id}`);
    return request.then((response: AxiosResponse<Recipe>) => response.data);
};

const GetRecipes = (): Promise<Recipe[]> => {
    const request = api.get("/recipes/");
    return request.then((response: AxiosResponse<Recipe[]>) => response.data);
};

const DeleteRecipe = (id: string): Promise<void> => {
    const request = api.delete(`/recipes/${id}`);
    return request.then((response: AxiosResponse<void>) => response.data);
}

const UpdateRecipe = (id: string, recipeData: Recipe): Promise<void> => {
    const request = api.put(`/recipes/${id}`, recipeData);
    return request.then((response: AxiosResponse<void>) => response.data);
}

const RecipeService = {
    GetRecipes,
    GetRecipe,
    CreateRecipe,
    DeleteRecipe,
    UpdateRecipe
};

export default RecipeService;