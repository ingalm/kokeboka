import { NextResponse } from "next/server";

import { isEditor } from "@/auth";
import { saveRecipe } from "@/db/repository";
import type { EditableRecipe } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const body = await request.json() as EditableRecipe | { recipe: EditableRecipe; republish?: boolean };
    const input = "recipe" in body ? body.recipe : body;
    const id = await saveRecipe(input, "recipe" in body ? { republish: body.republish } : undefined);
    return NextResponse.json({ id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke lagre oppskriften." }, { status: 400 });
  }
}
