import { NextResponse } from "next/server";
import sharp from "sharp";

import { isEditor } from "@/auth";
import { putR2Image } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const formData = await request.formData();
    const file = formData.get("image");
    const recipeId = formData.get("recipeId");
    const purpose = formData.get("purpose");
    if (!(file instanceof File)) return NextResponse.json({ error: "Velg en bildefil." }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Filen må være et bilde." }, { status: 400 });
    if (file.size > MAX_BYTES) return NextResponse.json({ error: "Bildet kan ikke være større enn 12 MB." }, { status: 400 });
    if (purpose !== "home" && !recipeId) return NextResponse.json({ error: "Bildet mangler en oppskrift." }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const image = await sharp(buffer).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const key = purpose === "home" ? `home/${crypto.randomUUID()}.webp` : `recipes/${recipeId}/${crypto.randomUUID()}.webp`;
    await putR2Image(key, image);
    return NextResponse.json({ key });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke behandle bildet." }, { status: 400 }); }
}
