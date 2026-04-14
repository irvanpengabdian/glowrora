/** Max recording / upload length (seconds), per sprint spec. */
export const MAX_VIDEO_DURATION_SEC = 120;

/** Upper bound for presigned upload size (bytes). */
export const MAX_VIDEO_BYTES = 120 * 1024 * 1024;

export const VIDEO_CONTENT_TYPES = [
  "video/webm",
  "video/mp4",
  "video/quicktime",
] as const;

export type VideoContentType = (typeof VIDEO_CONTENT_TYPES)[number];

export const VIDEO_EXTENSION: Record<VideoContentType, string> = {
  "video/webm": "webm",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
};

export const PRESIGN_EXPIRES_SEC = 15 * 60;
