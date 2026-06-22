/**
 * Client-side image downscaling.
 *
 * The API deploys as a Vercel serverless function with a 4.5MB request-body
 * limit. Mobile photos routinely exceed that, so we downscale/compress in the
 * browser before uploading. This is best-effort: on any failure we return the
 * original file unchanged and let the server enforce its own limit.
 */

interface DownscaleOptions {
  /** Longest side of the output, in pixels. */
  maxDimension?: number;
  /** Target ceiling for the output byte size. */
  maxBytes?: number;
  /** Initial JPEG quality (0–1). */
  quality?: number;
}

const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_MAX_BYTES = 4_000_000;
const DEFAULT_QUALITY = 0.85;

/** Quality ladder used when the first encode is still over the byte ceiling. */
const QUALITY_LADDER = [0.85, 0.7, 0.55, 0.4];

/** Derive a `.jpg` filename from the original (defaults to `photo.jpg`). */
function toJpgName(name: string | undefined): string {
  if (!name) return 'photo.jpg';
  const base = name.replace(/\.[^.]+$/, '');
  return `${base || 'photo'}.jpg`;
}

/** Wrap canvas.toBlob in a Promise. */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
  });
}

interface DecodedImage {
  width: number;
  height: number;
  source: CanvasImageSource;
  /** Releases any resources held by the decoded image (object URL, bitmap). */
  cleanup: () => void;
}

/**
 * Decode `file` into something drawable on a canvas. Prefers createImageBitmap
 * (honouring EXIF orientation); falls back to an HTMLImageElement + object URL.
 */
async function decodeImage(file: File): Promise<DecodedImage> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, {
        imageOrientation: 'from-image',
      });
      return {
        width: bitmap.width,
        height: bitmap.height,
        source: bitmap,
        cleanup: () => bitmap.close(),
      };
    } catch {
      // Fall through to the HTMLImageElement path.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Failed to decode image'));
      el.src = url;
    });
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      source: img,
      cleanup: () => URL.revokeObjectURL(url),
    };
  } catch (err) {
    URL.revokeObjectURL(url);
    throw err;
  }
}

/**
 * Render `decoded` to a canvas scaled so its longest side ≤ `maxDimension`
 * (never upscaling), then encode JPEG, walking down the quality ladder until
 * the result fits under `maxBytes`. Returns the smallest blob achieved.
 */
async function encodeUnderLimit(
  decoded: DecodedImage,
  maxDimension: number,
  maxBytes: number,
  startQuality: number,
): Promise<Blob | null> {
  const longest = Math.max(decoded.width, decoded.height);
  const scale = longest > maxDimension ? maxDimension / longest : 1;
  const width = Math.max(1, Math.round(decoded.width * scale));
  const height = Math.max(1, Math.round(decoded.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(decoded.source, 0, 0, width, height);

  const qualities = QUALITY_LADDER.filter((q) => q <= startQuality);
  const ladder = qualities.length ? qualities : [startQuality];

  let smallest: Blob | null = null;
  for (const quality of ladder) {
    const blob = await canvasToBlob(canvas, quality);
    if (!blob) continue;
    if (!smallest || blob.size < smallest.size) smallest = blob;
    if (blob.size <= maxBytes) return blob;
  }
  return smallest;
}

/**
 * Downscale/compress an image so it stays under `maxBytes`.
 *
 * Fast path: files already at or under `maxBytes` are returned untouched.
 * Otherwise the image is decoded, scaled so its longest side ≤ `maxDimension`,
 * and re-encoded as JPEG; quality is stepped down through a ladder and, if the
 * result is still over budget at the lowest quality, `maxDimension` is halved
 * once for a final retry. Best-effort: returns the smallest result achieved
 * even if marginally over. On ANY failure the original file is returned
 * unchanged so the upload still attempts. Never throws.
 */
export async function downscaleImage(
  file: File,
  opts: DownscaleOptions = {},
): Promise<File> {
  const maxDimension = opts.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES;
  const quality = opts.quality ?? DEFAULT_QUALITY;

  // Fast path: already small enough.
  if (file.size <= maxBytes) return file;

  let decoded: DecodedImage | null = null;
  try {
    decoded = await decodeImage(file);

    let blob = await encodeUnderLimit(decoded, maxDimension, maxBytes, quality);

    // Still over budget at the lowest quality: halve dimensions once and retry.
    if (blob && blob.size > maxBytes) {
      const retry = await encodeUnderLimit(
        decoded,
        Math.max(1, Math.round(maxDimension / 2)),
        maxBytes,
        quality,
      );
      if (retry && (!blob || retry.size < blob.size)) blob = retry;
    }

    if (!blob) {
      console.warn('[downscaleImage] encoding produced no blob; using original');
      return file;
    }

    return new File([blob], toJpgName(file.name), { type: 'image/jpeg' });
  } catch (err) {
    console.warn('[downscaleImage] failed; using original file', err);
    return file;
  } finally {
    decoded?.cleanup();
  }
}
