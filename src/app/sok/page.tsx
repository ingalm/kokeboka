import { Search } from "lucide-react";

import { RecipeCard } from "@/components/recipe-card";
import { listPublishedRecipes } from "@/db/repository";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const recipes = q.trim() ? await listPublishedRecipes({ title: q }) : [];
  return (
    <div className="page-shell">
      <div className="page-intro"><p className="eyebrow">Finn en favoritt</p><h1>Søk i oppskrifter</h1><p>Søket leter i oppskriftstitler.</p></div>
      <form className="search-form"><label className="search-field"><Search size={19} aria-hidden="true" /><input name="q" defaultValue={q} placeholder="Skriv en oppskriftstittel" aria-label="Søk etter oppskriftstittel" autoFocus /></label><button type="submit">Søk</button></form>
      {q.trim() && (recipes.length ? <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}</div> : <div className="empty-state"><h2>Ingen treff</h2><p>Vi fant ingen publiserte oppskrifter med «{q}» i tittelen.</p></div>)}
    </div>
  );
}
