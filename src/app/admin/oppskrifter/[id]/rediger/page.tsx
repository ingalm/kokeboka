import { notFound } from "next/navigation";

import { RecipeEditor } from "@/components/recipe-editor";
import { getRecipe, listTags } from "@/db/repository";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;
  const [recipe, tags] = await Promise.all([getRecipe(id, true), listTags()]);
  if (!recipe) notFound();
  return <div className="editor-page"><RecipeEditor initialRecipe={recipe} initialTags={tags} /></div>;
}
