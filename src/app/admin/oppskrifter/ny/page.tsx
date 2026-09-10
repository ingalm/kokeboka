import { RecipeEditor } from "@/components/recipe-editor";
import { listTags } from "@/db/repository";

export const dynamic = "force-dynamic";

export default async function NewRecipePage() {
  return <div className="editor-page"><RecipeEditor initialTags={await listTags()} /></div>;
}
