import type { InstructionType, RecipeStatus, Unit } from "@/lib/constants";

export type Tag = {
  id: string;
  name: string;
};

export type RecipeCardData = {
  id: string;
  title: string;
  slug: string;
  coverImageKey: string | null;
  status: RecipeStatus;
  publishedAt: Date | null;
  tags?: Tag[];
};

export type Ingredient = {
  id: string;
  amount: number | null;
  unit: Unit;
  name: string;
  note: string;
  position: number;
};

export type IngredientSection = {
  id: string;
  title: string;
  position: number;
  ingredients: Ingredient[];
};

export type Instruction = {
  id: string;
  kind: InstructionType;
  content: string;
  position: number;
};

export type RecipeDetail = RecipeCardData & {
  servings: number;
  ingredientSections: IngredientSection[];
  instructions: Instruction[];
  tags: Tag[];
  updatedAt: Date;
};

export type EditableIngredient = Omit<Ingredient, "id" | "position"> & { id: string };
export type EditableIngredientSection = Omit<IngredientSection, "id" | "position" | "ingredients"> & {
  id: string;
  ingredients: EditableIngredient[];
};
export type EditableInstruction = Omit<Instruction, "id" | "position"> & { id: string };

export type EditableRecipe = {
  id?: string;
  title: string;
  slug?: string;
  coverImageKey: string | null;
  servings: number;
  status: RecipeStatus;
  tagIds: string[];
  ingredientSections: EditableIngredientSection[];
  instructions: EditableInstruction[];
};
