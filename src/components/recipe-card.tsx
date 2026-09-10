import Image from "next/image";
import Link from "next/link";

import type { RecipeCardData } from "@/lib/types";
import { toRecipeHref } from "@/lib/utils";

export function RecipeCard({ recipe, showDraft }: { recipe: RecipeCardData; showDraft?: boolean }) {
  return (
    <Link className="recipe-card" href={toRecipeHref(recipe)}>
      <div className="recipe-card-image">
        {recipe.coverImageKey ? (
          <Image src={`/media/${recipe.coverImageKey}`} alt={recipe.title} fill unoptimized sizes="(max-width: 640px) 72vw, (max-width: 1100px) 38vw, 280px" />
        ) : (
          <div className="image-placeholder" aria-hidden="true"><span>Ingen bilde ennå</span></div>
        )}
        {showDraft && recipe.status === "draft" && <span className="draft-badge">Utkast</span>}
      </div>
      <span>{recipe.title}</span>
    </Link>
  );
}
