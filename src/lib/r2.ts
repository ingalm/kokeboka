import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

function configuration() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) return null;
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function client() {
  const config = configuration();
  if (!config) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
}

export function isR2Configured() {
  return Boolean(configuration());
}

export async function putR2Image(key: string, body: Uint8Array) {
  const config = configuration();
  const r2 = client();
  if (!config || !r2) throw new Error("Bildelagring er ikke konfigurert ennå.");
  await r2.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: body,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function getR2Image(key: string) {
  const config = configuration();
  const r2 = client();
  if (!config || !r2) return null;
  const result = await r2.send(new GetObjectCommand({ Bucket: config.bucket, Key: key }));
  return result.Body?.transformToByteArray() ?? null;
}

export async function deleteR2Image(key: string | null) {
  if (!key) return;
  const config = configuration();
  const r2 = client();
  if (!config || !r2) return;
  await r2.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}
