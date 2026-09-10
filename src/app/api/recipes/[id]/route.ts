import { NextResponse } from "next/server";

import { isEditor } from "@/auth";
import { deleteRecipe, getRecipeCoverImageKey, saveRecipe } from "@/db/repository";
import { deleteR2Image } from "@/lib/r2";
import type { EditableRecipe } from "@/lib/types";

export const runtime = "nodejs";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const body = await request.json() as EditableRecipe | { recipe: EditableRecipe; republish?: boolean };
    const input = "recipe" in body ? body.recipe : body;
    const id = (await params).id;
    if (input.id && input.id !== id) return NextResponse.json({ error: "Ugyldig oppskrifts-ID." }, { status: 400 });
    const previousCoverImageKey = await getRecipeCoverImageKey(id);
    await saveRecipe({ ...input, id }, "recipe" in body ? { republish: body.republish } : undefined);
    if (previousCoverImageKey && previousCoverImageKey !== input.coverImageKey) {
      try { await deleteR2Image(previousCoverImageKey); } catch { /* The saved recipe remains valid; an old object can be cleaned up later. */ }
    }
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke lagre oppskriften." }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: Props) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const key = await deleteRecipe((await params).id);
    await deleteR2Image(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke slette oppskriften." }, { status: 400 });
  }
}
