import { customAlphabet } from "nanoid";

import { VIDEO_EXTENSION, type VideoContentType } from "@/lib/r2/constants";

const safeId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);

export function buildVideoObjectKey(
  campaignId: string,
  contentType: VideoContentType,
): string {
  const ext = VIDEO_EXTENSION[contentType];
  return `videos/${campaignId}/${safeId()}.${ext}`;
}

const KEY_TAIL_RE = /^[a-z0-9]{21}\.(webm|mp4|mov)$/;

export function isVideoObjectKeyForCampaign(
  objectKey: string,
  campaignId: string,
): boolean {
  const prefix = `videos/${campaignId}/`;
  if (!objectKey.startsWith(prefix)) return false;
  const tail = objectKey.slice(prefix.length);
  return KEY_TAIL_RE.test(tail);
}
