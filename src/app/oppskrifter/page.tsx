import Link from "next/link";

import { isEditor } from "@/auth";
import { RecipeCard } from "@/components/recipe-card";
import { listOwnerRecipes, listPublishedRecipes, listTags } from "@/db/repository";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ tag?: string | string[] }> };

export default async function RecipesPage({ searchParams }: Props) {
  const params = await searchParams;
  const tagIds = (Array.isArray(params.tag) ? params.tag : params.tag ? [params.tag] : []).filter(Boolean);
  const editor = await isEditor();
  const [tags, allRecipes] = await Promise.all([listTags(), editor ? listOwnerRecipes() : listPublishedRecipes({ tagIds })]);
  const recipes = editor && tagIds.length ? allRecipes.filter((recipe) => recipe.tags?.some((tag) => tagIds.includes(tag.id))) : allRecipes;
  const nextHref = (tagId: string) => {
    const selected = tagIds.includes(tagId) ? tagIds.filter((id) => id !== tagId) : [...tagIds, tagId];
    return selected.length ? `/oppskrifter?${selected.map((id) => `tag=${encodeURIComponent(id)}`).join("&")}` : "/oppskrifter";
  };

  return (
    <div className="page-shell">
      <div className="page-intro"><p className="eyebrow">Oppskriftsarkivet</p><h1>Alle oppskrifter</h1><p>Velg én eller flere tagger. En oppskrift vises når den har minst én av taggene du har valgt.</p></div>
      {tags.length > 0 && <><div className="tag-filter" aria-label="Filtrer med tagger">{tags.map((tag) => <Link aria-pressed={tagIds.includes(tag.id)} key={tag.id} href={nextHref(tag.id)}>{tag.name}</Link>)}</div><p className="filter-help">Flere valgte tagger betyr «en av disse». Dette kan utvides med «alle» senere.</p></>}
      {recipes.length ? <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} showDraft={editor} />)}</div> : <div className="empty-state"><h2>Ingen oppskrifter ennå</h2><p>{tagIds.length ? "Ingen publiserte oppskrifter har disse taggene ennå." : "Kokeboka starter tom. De første publiserte oppskriftene vil vises her."}</p></div>}
    </div>
  );
}
