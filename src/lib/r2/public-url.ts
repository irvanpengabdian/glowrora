/**
 * Builds a public playback URL when the bucket is exposed via a custom domain
 * or R2.dev public URL (`R2_PUBLIC_BASE_URL`).
 */
export function publicUrlForR2ObjectKey(
  objectKey: string | null | undefined,
): string | null {
  if (!objectKey) return null;
  const base = process.env.R2_PUBLIC_BASE_URL?.trim();
  if (!base) return null;
  const cleanBase = base.replace(/\/+$/, "");
  const key = objectKey.replace(/^\/+/, "");
  return `${cleanBase}/${key}`;
}
