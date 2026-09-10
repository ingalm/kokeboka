import { NextResponse } from "next/server";

import { isEditor } from "@/auth";
import { isPublicMediaKey } from "@/db/repository";
import { getR2Image } from "@/lib/r2";

export const runtime = "nodejs";

type Props = { params: Promise<{ key: string[] }> };

export async function GET(_: Request, { params }: Props) {
  const key = (await params).key.join("/");
  const isPublic = await isPublicMediaKey(key);
  if (!isPublic && !(await isEditor())) return new NextResponse("Ikke funnet", { status: 404 });
  try {
    const image = await getR2Image(key);
    if (!image) return new NextResponse("Ikke funnet", { status: 404 });
    const body = new ArrayBuffer(image.byteLength);
    new Uint8Array(body).set(image);
    return new NextResponse(body, { headers: { "Content-Type": "image/webp", "Cache-Control": isPublic ? "public, max-age=31536000, immutable" : "private, no-store" } });
  } catch { return new NextResponse("Ikke funnet", { status: 404 }); }
}
