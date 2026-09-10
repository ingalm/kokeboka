import { OSLO_TIME_ZONE } from "@/lib/constants";

export function slugify(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("nb-NO")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "oppskrift";
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("nb-NO", {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 1,
  }).format(Math.round(value * 10) / 10);
}

export function osloDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: OSLO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function seededShuffle<T>(items: T[], seed: string) {
  let state = [...seed].reduce((total, character) => ((total << 5) - total + character.charCodeAt(0)) | 0, 0) >>> 0;
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  return [...items].sort(() => next() - 0.5);
}

export function toRecipeHref(recipe: { id: string; slug: string }) {
  return `/oppskrifter/${recipe.id}/${recipe.slug}`;
}
