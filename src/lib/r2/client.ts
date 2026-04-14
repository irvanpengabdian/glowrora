import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import {
  MAX_VIDEO_BYTES,
  PRESIGN_EXPIRES_SEC,
  type VideoContentType,
} from "@/lib/r2/constants";

let cached: S3Client | null = null;

export function getR2S3Client(): S3Client {
  if (cached) return cached;
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are not configured.");
  }
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export function getR2Bucket(): string {
  const bucket = process.env.R2_BUCKET_NAME;
  if (!bucket) throw new Error("R2_BUCKET_NAME is not set.");
  return bucket;
}

export async function presignVideoPut(
  objectKey: string,
  contentType: VideoContentType,
  byteLength: number,
): Promise<string> {
  if (byteLength > MAX_VIDEO_BYTES) {
    throw new Error("Video file is too large.");
  }
  const client = getR2S3Client();
  const Bucket = getR2Bucket();
  const command = new PutObjectCommand({
    Bucket,
    Key: objectKey,
    ContentType: contentType,
    ContentLength: byteLength,
  });
  return getSignedUrl(client, command, { expiresIn: PRESIGN_EXPIRES_SEC });
}

export async function headVideoObject(
  objectKey: string,
): Promise<{ contentLength: number; contentType?: string } | null> {
  try {
    const client = getR2S3Client();
    const Bucket = getR2Bucket();
    const out = await client.send(
      new HeadObjectCommand({ Bucket, Key: objectKey }),
    );
    const len = out.ContentLength;
    if (len == null) return null;
    return { contentLength: len, contentType: out.ContentType };
  } catch {
    return null;
  }
}
