# Kokeboka

A personal, public Norwegian cookbook. It is built with Next.js and TypeScript,
Neon PostgreSQL, Auth.js with Google sign-in, Vercel, and a private Cloudflare
R2 bucket for images.

## Run it locally

1. Copy `.env.example` to `.env.local` and fill in the service credentials.
2. Create the initial Neon schema with `npm run db:push`.
3. Start the app with `npm run dev`.

The initial database is deliberately empty. `drizzle/0000_right_warpath.sql`
is also retained as an exportable schema migration.

## Deploy it

Deploy the repository to Vercel and add every value from `.env.example` in the
Vercel project environment. Create a private R2 bucket, then grant its
S3-compatible API token read/write access to that bucket. In Google Cloud,
add this redirect URI to the OAuth client:

`https://YOUR-VERCEL-DOMAIN/api/auth/callback/google`

Set `ADMIN_EMAIL` to the exact Google email address that may edit the cookbook.
Every other visitor can only view published recipes. Create `AUTH_SECRET` as a
long random value (for example, with `openssl rand -base64 32`). Run
`npm run db:push` once against the production Neon database before using the
deployed app.

## Product decisions

### Product direction

- A new, initially empty personal cookbook.
- It must work well on both mobile devices and PCs.
- The visual direction is warm and recipe-book-like; it can be refined later.
- The interface language is Norwegian.
- The cookbook should be reachable from anywhere, rather than hosted on a
  Raspberry Pi.
- The application will use React and TypeScript with Next.js route handlers.
- Neon will provide the PostgreSQL database.
- Vercel will host the Next.js application and route handlers.
- Cloudflare R2 will store recipe cover images.
- Auth.js with direct Google OAuth will authenticate the sole editor.
- Free hosting and service tiers are preferred, but a paid option is acceptable
  if it materially improves the safety and portability of the recipe data.
- A PostgreSQL database is preferred because the recipe data must remain
  exportable and movable in the future.
- A custom domain is not currently needed.

### Recipes

- Each recipe has one uploaded cover image to support a visual browsing
  experience.
- Uploaded images should be resized and compressed automatically.
- Users can browse and search recipes.
- Search matches recipe titles only.
- The all-recipes page supports selecting multiple tags. By default, a recipe
  matches if it has any selected tag; the data and interface should allow an
  all-selected-tags mode to be added later.
- Published recipes are sorted newest-first on the all-recipes page.
- Republishing a recipe updates its publication date and returns it to the top
  of the newest-first list.
- Recipe cards are minimal, showing only the cover image and recipe title.
- Categories are represented by tags rather than a separate category system.
- Recipe instructions support tips placed between normal preparation steps.
- Recipe instructions also support section headings.
- The editor supports drag-and-drop reordering for ingredient sections/items
  and instruction headings/steps/tips.
- Recipes are either public or draft. A draft is a recipe not yet published
  publicly and is visible only to the owner.
- Recipes have an immutable internal ID and a human-readable title-based URL;
  changing a title must not break existing recipe links.
- A title is required when creating a recipe and recipe titles must be unique.
- Unpublishing a recipe returns it to draft status.
- Deleting a recipe permanently removes it and its R2 cover image.
- The editor saves work automatically; publishing remains an explicit action.
- The editor visibly reports automatic-save state, such as `Lagrer …` and
  `Lagret`.
- Recipe-page tags link to the all-recipes page filtered to that tag.
- Selected tag filters are reflected in shareable/bookmarkable URLs using
  stable tag IDs.
- Ingredients have structured amount, unit and name fields, plus an optional
  note. When an ingredient has a note, its unit is not shown.
- Ingredient units come from a fixed Norwegian list and quantities produced by
  serving scaling are rounded to one decimal.
- The fixed unit list is: `g`, `kg`, `ml`, `dl`, `l`, `ts`, `ss`, `stk`,
  `pakke`, `klype`, and no unit.
- Ingredient lists support section headings, such as "Deig" and "Fyll".
- Oven details are out of scope.

### Tags

- Tags are reusable labels that can be attached to recipes.
- The owner can create, rename and remove available tags.
- The owner can also create a new tag directly while editing a recipe.
- Removing a tag also removes its association from every recipe.
- Renaming a tag should update its visible name wherever it is used.
- Tags have an immutable internal ID separate from their editable visible name,
  preserving associations and links when renamed.

### Access and future scope

- Only the owner can create or edit recipes and tags.
- Recipes are publicly viewable without signing in.
- Draft recipes are private: they are visible only to the logged-in owner until
  explicitly published.
- Publishing requires a cover image, at least one ingredient, and at least one
  instruction; drafts may be incomplete.
- Google sign-in is the preferred editor authentication experience, avoiding
  application-managed passwords if it can be used without cost.
- Ingredient quantities should scale with the selected number of servings.
- A default number of servings is required before publishing.
- Visitors adjust recipe servings with simple plus/minus controls; the minimum
  is one serving.
- Logged-in owner views show drafts in the all-recipes view with a visible
  draft label and also provide a dedicated drafts-only view.
- Meal planning is a later feature, not part of the initial release.
- Automatic database backup/export is out of scope for now.

### Home page

- The home page includes a large main image selected in an owner-managed admin
  setting and a carousel of randomly selected recipe cards.
- Previously used main images are retained in a reusable settings library so
  the owner can switch back to them.
- The home-page image uses the alternative text "Home page image"; recipe
  cover images use their recipe title as alternative text.
- The carousel selection changes once per day.
- The daily carousel resets according to the `Europe/Oslo` time zone.
- The carousel selects 10 published recipes; the number visible at once adapts
  to screen size.
- It links onwards to dedicated search and all-recipes pages.
- Main navigation labels are: `Hjem`, `Søk`, and `Alle oppskrifter`. When the
  owner is signed in, it also shows `Utkast`, `Legg til oppskrift`, and
  `Innstillinger`.
