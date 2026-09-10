import { NextResponse } from "next/server";

import { isEditor } from "@/auth";
import { deleteTag, renameTag } from "@/db/repository";

type Props = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Props) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const { name } = await request.json() as { name?: string };
    await renameTag((await params).id, name ?? "");
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke endre taggen." }, { status: 400 }); }
}

export async function DELETE(_: Request, { params }: Props) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try { await deleteTag((await params).id); return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke slette taggen." }, { status: 400 }); }
}
