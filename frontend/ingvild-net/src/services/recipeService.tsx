import { AxiosResponse } from 'axios';
import api from './api';

export interface Recipe {
    id: number;
    recipe_name: string;
    last_edited: string;
    image_url: string;
    ingredients: Ingredient[];
    steps: Step[];
    };

export interface Ingredient {
    id: number;
    slug: string;
    ingredient_name: string;
    amount: number;
    measurement_type: string;
    };

export interface Step {
    id:number;
    slug: string;
    info: string;
}

const CreateRecipe = (recipeData: Recipe): Promise<void> => {
    const request = api.post('/recipes/', recipeData);
    return request.then((response: AxiosResponse<void>) => response.data);
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