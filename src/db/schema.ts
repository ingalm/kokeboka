import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const recipes = pgTable(
  "recipes",
  {
    id: uuid("id").primaryKey(),
    title: varchar("title", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    coverImageKey: text("cover_image_key"),
    servings: integer("servings").notNull().default(1),
    status: varchar("status", { length: 16 }).notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("recipes_title_unique").on(table.title)],
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 72 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("tags_name_unique").on(table.name)],
);

export const recipeTags = pgTable(
  "recipe_tags",
  {
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.recipeId, table.tagId] })],
);

export const ingredientSections = pgTable("ingredient_sections", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull().default("Ingredienser"),
  position: integer("position").notNull(),
});

export const ingredients = pgTable("ingredients", {
  id: uuid("id").primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => ingredientSections.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 3 }),
  unit: varchar("unit", { length: 12 }).notNull().default(""),
  name: varchar("name", { length: 180 }).notNull(),
  note: varchar("note", { length: 180 }).notNull().default(""),
  position: integer("position").notNull(),
});

export const instructions = pgTable("instructions", {
  id: uuid("id").primaryKey(),
  recipeId: uuid("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  kind: varchar("kind", { length: 12 }).notNull(),
  content: text("content").notNull(),
  position: integer("position").notNull(),
});

export const homeImages = pgTable("home_images", {
  id: uuid("id").primaryKey(),
  key: text("key").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: boolean("id").primaryKey().default(true),
  homeImageId: uuid("home_image_id").references(() => homeImages.id, { onDelete: "set null" }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const recipeRelations = relations(recipes, ({ many }) => ({
  recipeTags: many(recipeTags),
  ingredientSections: many(ingredientSections),
  instructions: many(instructions),
}));

export const tagRelations = relations(tags, ({ many }) => ({ recipeTags: many(recipeTags) }));
export const recipeTagRelations = relations(recipeTags, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeTags.recipeId], references: [recipes.id] }),
  tag: one(tags, { fields: [recipeTags.tagId], references: [tags.id] }),
}));
export const ingredientSectionRelations = relations(ingredientSections, ({ one, many }) => ({
  recipe: one(recipes, { fields: [ingredientSections.recipeId], references: [recipes.id] }),
  ingredients: many(ingredients),
}));
export const ingredientRelations = relations(ingredients, ({ one }) => ({
  section: one(ingredientSections, { fields: [ingredients.sectionId], references: [ingredientSections.id] }),
}));
