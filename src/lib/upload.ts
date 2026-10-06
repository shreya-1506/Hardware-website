import "server-only";

import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

import { slugify } from "./utils";

/**
 * Local image storage under `public/uploads`. This keeps the project runnable
 * with no external accounts; to move to S3/Supabase Storage/Cloudinary later,
 * replace `saveUpload` with an SDK call that returns the public URL — nothing
 * else in the app needs to change, because only the URL string is persisted.
 */

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

/** Raster only — user-supplied SVG can carry scripts. */
const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function saveUpload(
  file: File | null,
  hint = "image",
): Promise<UploadResult> {
  if (!file || file.size === 0) {
    return { ok: false, error: "No file selected." };
  }

  const extension = ALLOWED[file.type];
  if (!extension) {
    return {
      ok: false,
      error: "Unsupported file type. Please upload a JPG, PNG, WebP, AVIF or GIF image.",
    };
  }

  if (file.size > MAX_BYTES) {
    return {
      ok: false,
      error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 5 MB.`,
    };
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const base = slugify(hint) || "image";
  const name = `${base}-${Date.now().toString(36)}-${randomBytes(3).toString("hex")}.${extension}`;

  await fs.writeFile(path.join(UPLOAD_DIR, name), bytes);

  return { ok: true, url: `/uploads/${name}` };
}

/** Removes a previously uploaded file. Ignores anything outside /uploads. */
export async function deleteUpload(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const name = path.basename(url);
  try {
    await fs.unlink(path.join(UPLOAD_DIR, name));
  } catch {
    // Already gone — nothing to do.
  }
}
