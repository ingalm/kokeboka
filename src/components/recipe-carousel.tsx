"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { RecipeCard } from "@/components/recipe-card";
import type { RecipeCardData } from "@/lib/types";

export function RecipeCarousel({ recipes }: { recipes: RecipeCardData[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const move = (direction: 1 | -1) => rail.current?.scrollBy({ left: direction * 320, behavior: "smooth" });

  if (!recipes.length) {
    return <p className="muted-copy">Når du har publisert oppskrifter, vil et utvalg dukke opp her hver dag.</p>;
  }

  return (
    <section className="carousel-shell" aria-label="Dagens oppskrifter">
      <div className="carousel-controls" aria-hidden="true">
        <button type="button" onClick={() => move(-1)} aria-label="Forrige oppskrifter"><ChevronLeft /></button>
        <button type="button" onClick={() => move(1)} aria-label="Neste oppskrifter"><ChevronRight /></button>
      </div>
      <div className="recipe-rail" ref={rail}>
        {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>
    </section>
  );
}
