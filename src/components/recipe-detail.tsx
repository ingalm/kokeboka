"use client";

import Image from "next/image";
import Link from "next/link";
import { Lightbulb, Pencil } from "lucide-react";

import { ServingsControl } from "@/components/servings-control";
import type { RecipeDetail as RecipeDetailType } from "@/lib/types";
import { formatNumber } from "@/lib/utils";

export function RecipeDetail({ recipe, isEditor = false }: { recipe: RecipeDetailType; isEditor?: boolean }) {
  return (
    <article className="recipe-page">
      <div className="recipe-heading">
        <div>
          <p className="eyebrow">Oppskrift</p>
          <h1>{recipe.title}</h1>
          {recipe.tags.length > 0 && <div className="tag-row">{recipe.tags.map((tag) => <Link href={`/oppskrifter?tag=${tag.id}`} key={tag.id}>{tag.name}</Link>)}</div>}
          {isEditor && <Link className="edit-recipe-link" href={`/admin/oppskrifter/${recipe.id}/rediger`}><Pencil size={15} />Rediger oppskrift</Link>}
        </div>
        {recipe.coverImageKey && <div className="recipe-hero"><Image src={`/media/${recipe.coverImageKey}`} alt={recipe.title} fill priority unoptimized sizes="(max-width: 800px) 100vw, 45vw" /></div>}
      </div>
      <ServingsControl initialServings={recipe.servings}>
        {(servings) => (
          <div className="recipe-content-grid">
            <section className="ingredient-panel" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading">Ingredienser</h2>
              {recipe.ingredientSections.map((section) => (
                <div className="ingredient-section" key={section.id}>
                  {section.title && <h3>{section.title}</h3>}
                  <ul>
                    {section.ingredients.map((ingredient) => {
                      const amount = ingredient.amount === null ? null : ingredient.amount * (servings / recipe.servings);
                      return <li key={ingredient.id}><span>{amount === null ? "" : formatNumber(amount)} {ingredient.note ? "" : ingredient.unit}</span><b>{ingredient.name}</b>{ingredient.note && <em>{ingredient.note}</em>}</li>;
                    })}
                  </ul>
                </div>
              ))}
            </section>
            <section className="instructions-panel" aria-labelledby="method-heading">
              <h2 id="method-heading">Slik gjør du</h2>
              <ol>
                {recipe.instructions.map((item) => {
                  if (item.kind === "heading") return <li className="instruction-heading" key={item.id}>{item.content}</li>;
                  if (item.kind === "tip") return <li className="tip-card" key={item.id}><Lightbulb size={19} /><span>{item.content}</span></li>;
                  return <li className="instruction-step" key={item.id}>{item.content}</li>;
                })}
              </ol>
            </section>
          </div>
        )}
      </ServingsControl>
    </article>
  );
}
