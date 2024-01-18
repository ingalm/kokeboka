export interface Recipe {
    id: number;
    slug: string;
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