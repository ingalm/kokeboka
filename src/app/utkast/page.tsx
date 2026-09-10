import Link from "next/link";

import { RecipeCard } from "@/components/recipe-card";
import { listOwnerRecipes } from "@/db/repository";

export const dynamic = "force-dynamic";

export default async function DraftsPage() {
  const recipes = await listOwnerRecipes({ draftsOnly: true });
  return <div className="page-shell"><div className="page-intro"><p className="eyebrow">Bare for deg</p><h1>Utkast</h1><p>Påbegynte oppskrifter som ikke er synlige for besøkende.</p></div>{recipes.length ? <div className="recipe-grid">{recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} showDraft />)}</div> : <div className="empty-state"><h2>Ingen utkast</h2><p>Når du starter på en oppskrift, lagres den som utkast her.</p><Link className="button-primary" href="/admin/oppskrifter/ny">Legg til oppskrift</Link></div>}</div>;
}
