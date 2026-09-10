import { NextResponse } from "next/server";

import { isEditor } from "@/auth";
import { createTag, listTags } from "@/db/repository";

export async function GET() { return NextResponse.json({ tags: await listTags() }); }

export async function POST(request: Request) {
  if (!(await isEditor())) return NextResponse.json({ error: "Ikke autorisert." }, { status: 401 });
  try {
    const { name } = await request.json() as { name?: string };
    return NextResponse.json({ tag: await createTag(name ?? "") });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Kunne ikke opprette taggen." }, { status: 400 });
  }
}
