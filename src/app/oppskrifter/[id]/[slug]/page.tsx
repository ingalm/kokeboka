import { notFound, redirect } from "next/navigation";

import { isEditor } from "@/auth";
import { RecipeDetail } from "@/components/recipe-detail";
import { getRecipe } from "@/db/repository";
import { toRecipeHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string; slug: string }> };

export default async function RecipePage({ params }: Props) {
  const { id, slug } = await params;
  const editor = await isEditor();
  const recipe = await getRecipe(id, editor);
  if (!recipe) notFound();
  if (recipe.slug !== slug) redirect(toRecipeHref(recipe));
  return <RecipeDetail recipe={recipe} isEditor={editor} />;
}
