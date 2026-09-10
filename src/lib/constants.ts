export const UNITS = ["", "g", "kg", "ml", "dl", "l", "ts", "ss", "stk", "pakke", "klype"] as const;

export type Unit = (typeof UNITS)[number];

export const INSTRUCTION_TYPES = ["heading", "step", "tip"] as const;
export type InstructionType = (typeof INSTRUCTION_TYPES)[number];

export const RECIPE_STATUSES = ["draft", "published"] as const;
export type RecipeStatus = (typeof RECIPE_STATUSES)[number];

export const SITE_NAME = "Kokeboka";
export const OSLO_TIME_ZONE = "Europe/Oslo";
