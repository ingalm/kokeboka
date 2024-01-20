import { AxiosResponse } from 'axios';
import api from './api';
import { Recipe } from './types';

const CreateRecipe = (recipe: Recipe): Promise<{ success: boolean; recipeId: any; } | { success: boolean; slug?:string; error?: any; }> => {
    return api.post('/recipes/', recipe)
        .then(response => {
            const slug = response.data.slug;
            console.log("Recipe created with slug:", slug);
            console.log(response.data);

            return {
                success: true,
                slug: slug
            };
        })
        .catch(error => {
            console.error("Error creating recipe:", error);
            return {
                success: false,
                error: error
            };
        });
};

const GetRecipe = (slug: string): Promise<Recipe>  => {
    const request = api.get(`/recipes/${slug}`);
    return request.then((response: AxiosResponse<Recipe>) => response.data);
};

const GetRecipes = (): Promise<Recipe[]> => {
    const request = api.get("/recipes/");
    return request.then((response: AxiosResponse<Recipe[]>) => response.data);
};

const DeleteRecipe = (slug: string): Promise<void> => {
    const request = api.delete(`/recipes/${slug}`);
    return request.then((response: AxiosResponse<void>) => response.data);
}

const UpdateRecipe = (slug: string, recipe: Recipe): Promise<void> => {
    const request = api.put(`/recipes/${slug}`, recipe);
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