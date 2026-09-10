import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { isEditor } from "@/auth";
import { getDb } from "@/db/client";
import { homeImages, siteSettings } from "@/db/schema";

export async function GET() {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  const db = getDb();
  if (!db) return NextResponse.json({ images: [] });
  return NextResponse.json({ images: await db.select().from(homeImages).orderBy(homeImages.createdAt) });
}

export async function PUT(request: Request) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const { key } = await request.json() as { key?: string };
    if (!key?.startsWith("home/")) return NextResponse.json({ error: "Ugyldig hovedbilde." }, { status: 400 });
    const db = getDb(); if (!db) throw new Error("Databasen er ikke konfigurert ennå.");
    const existing = await db.select().from(homeImages).where(eq(homeImages.key, key)).limit(1);
    const image = existing[0] ?? { id: crypto.randomUUID(), key };
    if (!existing[0]) await db.insert(homeImages).values(image);
    const settings = await db.select().from(siteSettings).limit(1);
    if (settings[0]) await db.update(siteSettings).set({ homeImageId: image.id, updatedAt: new Date() }).where(eq(siteSettings.id, true));
    else await db.insert(siteSettings).values({ id: true, homeImageId: image.id });
    return NextResponse.json({ image });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke velge hovedbildet." }, { status: 400 }); }
}
