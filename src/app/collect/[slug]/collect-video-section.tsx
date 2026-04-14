"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  MAX_VIDEO_BYTES,
  MAX_VIDEO_DURATION_SEC,
  VIDEO_CONTENT_TYPES,
} from "@/lib/r2/constants";

type UploadedMeta = {
  objectKey: string;
  contentType: string;
  byteLength: number;
  durationSec: number;
};

type Props = {
  slug: string;
  /** Campaign accepts video; false hides the whole block. */
  allowVideo: boolean;
  /** R2 env present on server — without it we only show copy, no upload. */
  uploadsReady: boolean;
  onBlockSubmitChange: (blocked: boolean) => void;
};

function toApiContentType(blobType: string, fileName?: string): string | null {
  const base = blobType.split(";")[0].trim().toLowerCase();
  if (
    (VIDEO_CONTENT_TYPES as readonly string[]).includes(base)
  ) {
    return base;
  }
  if (base === "video/x-matroska") return "video/webm";
  if (!base && fileName) return extToContentType(fileName);
  return fileName ? extToContentType(fileName) : null;
}

function extToContentType(name: string): string | null {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "video/webm";
  if (ext === "mp4") return "video/mp4";
  if (ext === "mov") return "video/quicktime";
  return null;
}

function pickRecorderMime(): string {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of candidates) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

function formatMs(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

async function readVideoFileMeta(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = document.createElement("video");
    el.preload = "metadata";
    el.src = url;
    el.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      if (!Number.isFinite(el.duration) || el.duration <= 0) {
        reject(new Error("Could not read video length."));
        return;
      }
      resolve(el.duration);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video file."));
    };
  });
}

async function presignAndPut(
  slug: string,
  blob: Blob,
  contentType: string,
): Promise<{ objectKey: string }> {
  const res = await fetch(
    `/api/public/collect/${encodeURIComponent(slug)}/video/presign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contentType,
        byteLength: blob.size,
      }),
    },
  );
  const data = (await res.json()) as {
    error?: string;
    uploadUrl?: string;
    objectKey?: string;
    contentType?: string;
  };
  if (!res.ok) {
    throw new Error(data.error || "Could not start upload.");
  }
  if (!data.uploadUrl || !data.objectKey || !data.contentType) {
    throw new Error("Invalid upload response.");
  }
  const put = await fetch(data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": data.contentType },
    body: blob,
  });
  if (!put.ok) {
    throw new Error("Upload failed. Check your connection and try again.");
  }
  return { objectKey: data.objectKey };
}

export function CollectVideoSection({
  slug,
  allowVideo,
  uploadsReady,
  onBlockSubmitChange,
}: Props) {
  const [uploaded, setUploaded] = useState<UploadedMeta | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [busy, setBusy] = useState<
    "idle" | "recording" | "uploading" | "preparing"
  >("idle");
  const [elapsedMs, setElapsedMs] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recordStartRef = useRef<number>(0);

  const clearTick = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const stopStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      clearTick();
      stopStream();
    };
  }, [stopStream]);

  useEffect(() => {
    const url = previewUrl;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [previewUrl]);

  useEffect(() => {
    const blocked =
      busy === "recording" || busy === "uploading" || busy === "preparing";
    onBlockSubmitChange(blocked);
  }, [busy, onBlockSubmitChange]);

  const resetRecordingUi = useCallback(() => {
    clearTick();
    stopStream();
    recorderRef.current = null;
    chunksRef.current = [];
    setElapsedMs(0);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setBusy("idle");
  }, [stopStream]);

  const finalizeBlob = useCallback(
    async (blob: Blob, durationSec: number) => {
      if (!uploadsReady) {
        setLocalError("Video uploads are not configured.");
        return;
      }
      if (blob.size > MAX_VIDEO_BYTES) {
        setLocalError("Video is too large. Try a shorter clip.");
        return;
      }
      const ct =
        toApiContentType(blob.type) ??
        (blob instanceof File ? extToContentType(blob.name) : null);
      if (!ct) {
        setLocalError("Unsupported video format. Use WebM, MP4, or MOV.");
        return;
      }
      setLocalError(null);
      setBusy("uploading");
      try {
        const { objectKey } = await presignAndPut(slug, blob, ct);
        setUploaded({
          objectKey,
          contentType: ct,
          byteLength: blob.size,
          durationSec: Math.min(MAX_VIDEO_DURATION_SEC, Math.max(1, durationSec)),
        });
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      } catch (e) {
        setLocalError(e instanceof Error ? e.message : "Upload failed.");
        setUploaded(null);
      } finally {
        setBusy("idle");
      }
    },
    [slug, uploadsReady],
  );

  const stopRecording = useCallback(() => {
    const rec = recorderRef.current;
    if (!rec || rec.state === "inactive") return;
    rec.stop();
  }, []);

  const startRecording = async () => {
    setLocalError(null);
    setUploaded(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    if (!uploadsReady) {
      setLocalError("Video uploads are not available for this site yet.");
      return;
    }

    const mime = pickRecorderMime();
    if (!mime) {
      setLocalError(
        "This browser cannot record video here. Use the file upload option instead.",
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      mediaStreamRef.current = stream;
      chunksRef.current = [];
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = rec;
      recordStartRef.current = Date.now();

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      rec.onstop = () => {
        clearTick();
        stopStream();
        const blob = new Blob(chunksRef.current, { type: mime });
        chunksRef.current = [];
        recorderRef.current = null;
        const elapsed = Math.min(
          MAX_VIDEO_DURATION_SEC * 1000,
          Date.now() - recordStartRef.current,
        );
        const durationSec = Math.max(
          1,
          Math.min(MAX_VIDEO_DURATION_SEC, Math.ceil(elapsed / 1000)),
        );
        void finalizeBlob(blob, durationSec);
      };

      setBusy("recording");
      setElapsedMs(0);
      rec.start(400);

      tickRef.current = setInterval(() => {
        const ms = Date.now() - recordStartRef.current;
        setElapsedMs(ms);
        if (ms >= MAX_VIDEO_DURATION_SEC * 1000) {
          stopRecording();
        }
      }, 200);
    } catch {
      setLocalError(
        "Could not access camera or microphone. Check permissions and try again.",
      );
      setBusy("idle");
    }
  };

  const onPickFile = async (file: File | null) => {
    if (!file) return;
    setLocalError(null);
    setUploaded(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });

    if (!uploadsReady) {
      setLocalError("Video uploads are not available for this site yet.");
      return;
    }

    if (file.size > MAX_VIDEO_BYTES) {
      setLocalError("File is too large.");
      return;
    }

    setBusy("preparing");
    try {
      const durationRaw = await readVideoFileMeta(file);
      if (Math.ceil(durationRaw) > MAX_VIDEO_DURATION_SEC) {
        setLocalError(
          `Video must be at most ${MAX_VIDEO_DURATION_SEC} seconds.`,
        );
        setBusy("idle");
        return;
      }
      const ct =
        toApiContentType(file.type, file.name) ?? extToContentType(file.name);
      if (!ct) {
        setLocalError("Unsupported video format. Use WebM, MP4, or MOV.");
        setBusy("idle");
        return;
      }
      const durationSec = Math.min(
        MAX_VIDEO_DURATION_SEC,
        Math.max(1, Math.ceil(durationRaw)),
      );
      await finalizeBlob(file, durationSec);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "Could not use this file.");
      setBusy("idle");
    }
  };

  const clearVideo = () => {
    resetRecordingUi();
    setUploaded(null);
    setLocalError(null);
  };

  if (!allowVideo) return null;

  return (
    <div className="space-y-3 rounded-2xl border border-outline-variant/25 bg-surface-container-low/40 p-4">
      <div>
        <p className="tf-label">Video testimonial (optional)</p>
        <p className="mt-1 text-xs text-on-surface-variant">
          Add a short clip (up to {MAX_VIDEO_DURATION_SEC} seconds) or submit
          text only. You can record in the browser or upload a file.
        </p>
      </div>

      {!uploadsReady ? (
        <p className="text-sm text-on-secondary-container">
          Video uploads are not configured on this deployment — you can still
          send a written testimonial below.
        </p>
      ) : null}

      {localError ? (
        <p
          className="rounded-xl border border-error-container bg-error-container/90 px-3 py-2 text-sm text-on-error-container"
          role="alert"
        >
          {localError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {busy !== "recording" ? (
          <button
            type="button"
            onClick={() => void startRecording()}
            disabled={!uploadsReady || busy === "uploading" || busy === "preparing"}
            className="tf-btn-primary rounded-xl px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy === "uploading" || busy === "preparing"
              ? "Working…"
              : "Record video"}
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="rounded-xl border border-error-container bg-error-container/15 px-4 py-2 text-sm font-medium text-error-container"
          >
            Stop ({formatMs(elapsedMs)} / {formatMs(MAX_VIDEO_DURATION_SEC * 1000)})
          </button>
        )}

        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-outline-variant/40 bg-surface px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50">
          <input
            type="file"
            accept="video/webm,video/mp4,video/quicktime,.webm,.mp4,.mov"
            className="sr-only"
            disabled={!uploadsReady || busy === "uploading" || busy === "preparing" || busy === "recording"}
            onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
          />
          Upload video file
        </label>

        {uploaded ? (
          <button
            type="button"
            onClick={clearVideo}
            className="text-sm font-medium text-secondary underline-offset-4 hover:underline"
          >
            Remove video
          </button>
        ) : null}
      </div>

      {previewUrl ? (
        <video
          src={previewUrl}
          controls
          className="mt-2 max-h-56 w-full rounded-xl border border-outline-variant/30 bg-black/80"
        />
      ) : null}

      {uploaded ? (
        <p className="text-xs text-on-surface-variant">
          Video ready — submit the form to send it with your message.
        </p>
      ) : null}

      <input type="hidden" name="videoObjectKey" value={uploaded?.objectKey ?? ""} />
      <input type="hidden" name="videoContentType" value={uploaded?.contentType ?? ""} />
      <input type="hidden" name="videoByteLength" value={uploaded?.byteLength ?? ""} />
      <input type="hidden" name="videoDurationSec" value={uploaded?.durationSec ?? ""} />
    </div>
  );
}
