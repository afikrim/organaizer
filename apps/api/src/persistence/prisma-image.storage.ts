import { Injectable } from '@nestjs/common';
import { ImageStorage, ImageStorageRecord, StoredImage } from './image.storage';
import { PrismaService } from './prisma.service';

/**
 * Prisma-backed ImageStorage adapter.
 *
 * Milestone 6c scope:
 * - Image METADATA (key, sessionId, originalName, mimeType, sizeBytes) is persisted
 *   to the image_objects table in Postgres.
 * - Image BYTES and the in-process URL are kept in-memory maps for the lifetime of the
 *   process. This is intentional for this milestone: Supabase Storage (or another blob
 *   store) integration is out of scope here.  A future milestone will move bytes out of
 *   process and replace the in-memory buffer map with a signed-URL lookup.
 * - getUrl returns the local URL that was passed at save() time. It is not persisted to
 *   the DB because the URL is process-local (includes host/port) and cannot be treated
 *   as durable state.
 * - get() returns the buffer + metadata if still held in the in-process map. After a
 *   restart the buffer map is empty, so the /v1/images route will 404 for prior uploads.
 *   This is acceptable until blob storage is wired up.
 */
@Injectable()
export class PrismaImageStorage implements ImageStorage {
  // In-process buffers: key → { buffer, mimetype, originalname, sessionId }
  private readonly buffers = new Map<string, ImageStorageRecord>();
  // In-process URL map: key → imageUrl
  private readonly urls = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  async save(
    key: string,
    image: StoredImage,
    imageUrl: string,
    sessionId: string,
  ): Promise<void> {
    // Persist metadata to DB.
    await this.prisma.imageObject.upsert({
      where: { key },
      create: {
        key,
        sessionId,
        originalName: image.originalname,
        mimeType: image.mimetype,
        sizeBytes: image.buffer.length,
      },
      update: {},
    });

    // Keep bytes and URL in-process (see class-level comment above).
    this.buffers.set(key, { ...image, sessionId });
    this.urls.set(key, imageUrl);
  }

  async get(key: string): Promise<ImageStorageRecord | undefined> {
    // Return from in-process buffer if available.
    const cached = this.buffers.get(key);
    if (cached) return cached;

    // If not in buffer (e.g. after restart), fall back to DB metadata only.
    // We cannot reconstruct the buffer bytes from the DB in this milestone.
    // Return undefined so the caller can surface a 404; the image must be re-uploaded.
    return undefined;
  }

  async getUrl(key: string): Promise<string | undefined> {
    // URL is process-local; not stored in DB (see class-level comment above).
    return this.urls.get(key);
  }
}
