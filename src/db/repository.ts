import { and, asc, desc, eq, ilike, inArray, isNotNull, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  homeImages,
  ingredients,
  ingredientSections,
  instructions,
  recipes,
  recipeTags,
  siteSettings,
  tags,
} from "@/db/schema";
import type { EditableRecipe, Ingredient, IngredientSection, Instruction, RecipeCardData, RecipeDetail, Tag } from "@/lib/types";
import { slugify } from "@/lib/utils";

function cardFromRow(row: typeof recipes.$inferSelect): RecipeCardData {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    coverImageKey: row.coverImageKey,
    status: row.status as RecipeCardData["status"],
    publishedAt: row.publishedAt,
  };
}

export async function listTags(): Promise<Tag[]> {
  const db = getDb();
  if (!db) return [];
  return db.select({ id: tags.id, name: tags.name }).from(tags).orderBy(asc(tags.name));
}

async function tagsForRecipes(recipeIds: string[]) {
  const db = getDb();
  const grouped = new Map<string, Tag[]>();
  if (!db || recipeIds.length === 0) return grouped;

  const rows = await db
    .select({ recipeId: recipeTags.recipeId, id: tags.id, name: tags.name })
    .from(recipeTags)
    .innerJoin(tags, eq(recipeTags.tagId, tags.id))
    .where(inArray(recipeTags.recipeId, recipeIds));

  for (const row of rows) {
    grouped.set(row.recipeId, [...(grouped.get(row.recipeId) ?? []), { id: row.id, name: row.name }]);
  }
  return grouped;
}

export async function listPublishedRecipes(options?: { tagIds?: string[]; title?: string }) {
  const db = getDb();
  if (!db) return [] as RecipeCardData[];
  const filters = [eq(recipes.status, "published"), isNotNull(recipes.publishedAt)];
  if (options?.title?.trim()) filters.push(ilike(recipes.title, `%${options.title.trim()}%`));

  let rows = await db.select().from(recipes).where(and(...filters)).orderBy(desc(recipes.publishedAt));
  if (options?.tagIds?.length) {
    const matching = await db
      .selectDistinct({ recipeId: recipeTags.recipeId })
      .from(recipeTags)
      .where(inArray(recipeTags.tagId, options.tagIds));
    const matchingIds = new Set(matching.map((row) => row.recipeId));
    rows = rows.filter((recipe) => matchingIds.has(recipe.id));
  }

  const recipeTagsByRecipe = await tagsForRecipes(rows.map((row) => row.id));
  return rows.map((row) => ({ ...cardFromRow(row), tags: recipeTagsByRecipe.get(row.id) ?? [] }));
}

export async function listOwnerRecipes(options?: { draftsOnly?: boolean }) {
  const db = getDb();
  if (!db) return [] as RecipeCardData[];
  const rows = await db
    .select()
    .from(recipes)
    .where(options?.draftsOnly ? eq(recipes.status, "draft") : undefined)
    .orderBy(desc(recipes.publishedAt), desc(recipes.updatedAt));
  const recipeTagsByRecipe = await tagsForRecipes(rows.map((row) => row.id));
  return rows.map((row) => ({ ...cardFromRow(row), tags: recipeTagsByRecipe.get(row.id) ?? [] }));
}

export async function getRecipe(id: string, includeDraft = false): Promise<RecipeDetail | null> {
  const db = getDb();
  if (!db) return null;
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(includeDraft ? eq(recipes.id, id) : and(eq(recipes.id, id), eq(recipes.status, "published")))
    .limit(1);
  if (!recipe) return null;

  const [recipeTagsByRecipe, sectionRows, instructionRows] = await Promise.all([
    tagsForRecipes([id]),
    db.select().from(ingredientSections).where(eq(ingredientSections.recipeId, id)).orderBy(asc(ingredientSections.position)),
    db.select().from(instructions).where(eq(instructions.recipeId, id)).orderBy(asc(instructions.position)),
  ]);
  const ingredientRows = sectionRows.length
    ? await db.select().from(ingredients).where(inArray(ingredients.sectionId, sectionRows.map((section) => section.id))).orderBy(asc(ingredients.position))
    : [];

  const sections: IngredientSection[] = sectionRows.map((section) => ({
    id: section.id,
    title: section.title,
    position: section.position,
    ingredients: ingredientRows
      .filter((ingredient) => ingredient.sectionId === section.id)
      .map((ingredient) => ({
        id: ingredient.id,
        amount: ingredient.amount === null ? null : Number(ingredient.amount),
        unit: ingredient.unit as Ingredient["unit"],
        name: ingredient.name,
        note: ingredient.note,
        position: ingredient.position,
      })),
  }));

  return {
    ...cardFromRow(recipe),
    servings: recipe.servings,
    tags: recipeTagsByRecipe.get(id) ?? [],
    ingredientSections: sections,
    instructions: instructionRows.map((item) => ({
      id: item.id,
      kind: item.kind as Instruction["kind"],
      content: item.content,
      position: item.position,
    })),
    updatedAt: recipe.updatedAt,
  };
}

export async function getHomeImage() {
  const db = getDb();
  if (!db) return null;
  const [setting] = await db.select().from(siteSettings).limit(1);
  if (!setting?.homeImageId) return null;
  const [image] = await db.select().from(homeImages).where(eq(homeImages.id, setting.homeImageId)).limit(1);
  return image ?? null;
}

export async function isPublicMediaKey(key: string) {
  const db = getDb();
  if (!db) return false;
  const [recipe] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(and(eq(recipes.coverImageKey, key), eq(recipes.status, "published")))
    .limit(1);
  if (recipe) return true;
  const homeImage = await getHomeImage();
  return homeImage?.key === key;
}

export async function createTag(name: string) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Taggen må ha et navn.");
  const [existing] = await db.select().from(tags).where(sql`lower(${tags.name}) = lower(${cleanName})`).limit(1);
  if (existing) return { id: existing.id, name: existing.name };
  const tag = { id: crypto.randomUUID(), name: cleanName };
  await db.insert(tags).values(tag);
  return tag;
}

export async function renameTag(id: string, name: string) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  const cleanName = name.trim();
  if (!cleanName) throw new Error("Taggen må ha et navn.");
  const [matchingTag] = await db.select({ id: tags.id }).from(tags).where(sql`lower(${tags.name}) = lower(${cleanName})`).limit(1);
  if (matchingTag && matchingTag.id !== id) throw new Error("En annen tagg har allerede dette navnet.");
  await db.update(tags).set({ name: cleanName }).where(eq(tags.id, id));
}

export async function deleteTag(id: string) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  await db.delete(tags).where(eq(tags.id, id));
}

function getRecipeWriteData(input: EditableRecipe) {
  const title = input.title.trim();
  if (!title) throw new Error("Oppskriften må ha en tittel.");
  return { title, slug: slugify(title), servings: Math.max(1, Math.round(input.servings || 1)) };
}

function validatePublishedRecipe(input: EditableRecipe) {
  if (!input.coverImageKey) throw new Error("En publisert oppskrift må ha et forsidebilde.");
  if (!input.ingredientSections.some((section) => section.ingredients.some((ingredient) => ingredient.name.trim()))) {
    throw new Error("En publisert oppskrift må ha minst én ingrediens.");
  }
  if (!input.instructions.some((instruction) => instruction.content.trim() && instruction.kind !== "heading")) {
    throw new Error("En publisert oppskrift må ha minst ett steg eller tips.");
  }
}

async function replaceRecipeContent(db: any, recipeId: string, input: EditableRecipe) {
  await db.delete(ingredientSections).where(eq(ingredientSections.recipeId, recipeId));
  await db.delete(instructions).where(eq(instructions.recipeId, recipeId));
  await db.delete(recipeTags).where(eq(recipeTags.recipeId, recipeId));

  for (const [sectionIndex, section] of input.ingredientSections.entries()) {
    const sectionId = crypto.randomUUID();
    await db.insert(ingredientSections).values({
      id: sectionId,
      recipeId,
      title: section.title.trim() || "Ingredienser",
      position: sectionIndex,
    });
    const cleanIngredients = section.ingredients.filter((ingredient) => ingredient.name.trim());
    if (cleanIngredients.length) {
      await db.insert(ingredients).values(
        cleanIngredients.map((ingredient, position) => ({
          id: crypto.randomUUID(),
          sectionId,
          amount: ingredient.amount === null || Number.isNaN(ingredient.amount) ? null : String(ingredient.amount),
          unit: ingredient.note.trim() ? "" : ingredient.unit,
          name: ingredient.name.trim(),
          note: ingredient.note.trim(),
          position,
        })),
      );
    }
  }

  const cleanInstructions = input.instructions.filter((instruction) => instruction.content.trim());
  if (cleanInstructions.length) {
    await db.insert(instructions).values(
      cleanInstructions.map((instruction, position) => ({
        id: crypto.randomUUID(),
        recipeId,
        kind: instruction.kind,
        content: instruction.content.trim(),
        position,
      })),
    );
  }
  const uniqueTagIds = [...new Set(input.tagIds)];
  if (uniqueTagIds.length) await db.insert(recipeTags).values(uniqueTagIds.map((tagId) => ({ recipeId, tagId })));
}

export async function saveRecipe(input: EditableRecipe, options?: { republish?: boolean }) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  const data = getRecipeWriteData(input);
  if (input.status === "published") validatePublishedRecipe(input);
  const now = new Date();

  const [matchingTitle] = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(sql`lower(${recipes.title}) = lower(${data.title})`)
    .limit(1);
  if (matchingTitle && matchingTitle.id !== input.id) throw new Error("En oppskrift har allerede denne tittelen.");

  const [existing] = input.id
    ? await db.select({ id: recipes.id, status: recipes.status, publishedAt: recipes.publishedAt }).from(recipes).where(eq(recipes.id, input.id)).limit(1)
    : [];
  if (input.id && !existing) throw new Error("Oppskriften finnes ikke.");
  const publishedAt = input.status !== "published"
    ? null
    : !existing || existing.status !== "published" || options?.republish
      ? now
      : existing.publishedAt ?? now;

  const result = await db.transaction(async (tx) => {
    let id = input.id;
    if (!id) {
      id = crypto.randomUUID();
      await tx.insert(recipes).values({
        id,
        ...data,
        coverImageKey: input.coverImageKey,
        status: input.status,
        publishedAt,
        updatedAt: now,
      });
    } else {
      await tx
        .update(recipes)
        .set({ ...data, coverImageKey: input.coverImageKey, status: input.status, publishedAt, updatedAt: now })
        .where(eq(recipes.id, id));
    }
    await replaceRecipeContent(tx, id, input);
    return id;
  });
  return result;
}

export async function getRecipeCoverImageKey(id: string) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  const [recipe] = await db.select({ coverImageKey: recipes.coverImageKey }).from(recipes).where(eq(recipes.id, id)).limit(1);
  return recipe?.coverImageKey ?? null;
}

export async function deleteRecipe(id: string) {
  const db = getDb();
  if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
  const [recipe] = await db.select().from(recipes).where(eq(recipes.id, id)).limit(1);
  if (!recipe) return null;
  await db.delete(recipes).where(eq(recipes.id, id));
  return recipe.coverImageKey;
}
