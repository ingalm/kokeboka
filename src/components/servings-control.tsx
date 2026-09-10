"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

import { formatNumber } from "@/lib/utils";

export function ServingsControl({ initialServings, children }: { initialServings: number; children: (servings: number) => React.ReactNode }) {
  const [servings, setServings] = useState(initialServings);
  return (
    <div className="servings-area">
      <div className="servings-control" aria-label="Porsjoner">
        <button type="button" disabled={servings <= 1} onClick={() => setServings((value) => Math.max(1, value - 1))} aria-label="Færre porsjoner"><Minus size={17} /></button>
        <span><strong>{formatNumber(servings)}</strong> porsjoner</span>
        <button type="button" onClick={() => setServings((value) => value + 1)} aria-label="Flere porsjoner"><Plus size={17} /></button>
      </div>
      {children(servings)}
    </div>
  );
}
