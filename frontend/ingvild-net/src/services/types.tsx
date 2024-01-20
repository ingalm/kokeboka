export interface Recipe {
    slug: string;
    recipe_name: string;
    last_edited: string;
    img_url: string;
    ingredient_list: Ingredient[];
    step_list: Step[];
    est_time?: { hours?: number; minutes?: number }; // Optional
    oven_function?: OvenFunction; // Optional
}

export interface Ingredient {
    ingredient_name: string;
    amount?: number; // Optional
    measurement_type?: string; // Optional
}

export interface Step {
    type: number;
    info: string;
}

export interface OvenFunction {
    degrees?: number;  // Optional
    function_name?: string;  // Optional
}