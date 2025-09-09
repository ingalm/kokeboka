export interface Recipe {
    slug: string;
    recipe_name: string;
    last_edited: string;
    img_url: string;
    ingredient_list: Ingredient[];
    step_list: Step[];
    est_time?: string; // Optional
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

//Values for dropdown menus
export let ovenFunctionNames: string[] = ["Oven function", "Over-Undervarme", "Varmluft"]
export let timeEstimations: string[] = ["0-15 min", "15-30 min", "30-45 min", "45-60 min", "60+ min"]
export let instructionNames: string[] = ["Instruksjon", "Tips"]