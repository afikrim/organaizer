import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ImageStorage, ImageStorageRecord, StoredImage } from './image.storage';
import { errorEnvelope } from '../common/error.envelope';
import { PrismaService } from './prisma.service';

/**
 * Supabase Storage-backed ImageStorage adapter.
 *
 * Opt-in via STORAGE_DRIVER=supabase.
 *
 * - save() uploads the image bytes to a Supabase Storage bucket at path `key`.
 * - getUrl() mints a fresh signed URL on demand; the SPA loads the image directly
 *   from that URL, so the API never proxies bytes in this mode.
 * - get() returns undefined: in Supabase mode the /v1/images route is unused because
 *   the client fetches images straight from the signed URL. This mirrors how
 *   PrismaImageStorage returns undefined after restart.
 */
@Injectable()
export class SupabaseImageStorage implements ImageStorage {
  private readonly client: SupabaseClient;
  private readonly bucket: string;
  private readonly signedUrlTtl: number;

  constructor(private readonly prisma: PrismaService) {
    const url = process.env['SUPABASE_URL'];
    if (!url) {
      throw new Error(
        'SUPABASE_URL is required when STORAGE_DRIVER=supabase. Set it in .env or environment.',
      );
    }

    const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
    if (!serviceRoleKey) {
      throw new Error(
        'SUPABASE_SERVICE_ROLE_KEY is required when STORAGE_DRIVER=supabase. Set it in .env or environment.',
      );
    }

    this.bucket = process.env['SUPABASE_STORAGE_BUCKET'] ?? 'analyses';
    // Default 24h. Guard against a non-numeric/zero env value silently producing
    // NaN (which would make every signed URL fail and images 404).
    const ttl = Number(process.env['SUPABASE_SIGNED_URL_TTL']);
    this.signedUrlTtl = Number.isFinite(ttl) && ttl > 0 ? ttl : 86_400;

    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async save(
    key: string,
    image: StoredImage,
    _imageUrl: string,
    sessionId: string,
  ): Promise<void> {
    void _imageUrl;

    const { error } = await this.client.storage
      .from(this.bucket)
      .upload(key, image.buffer, {
        contentType: image.mimetype,
        upsert: true,
      });

    if (error) {
      throw new InternalServerErrorException(
        errorEnvelope(
          'storage_unavailable',
          `Failed to upload image to Supabase Storage: ${error.message}`,
        ),
      );
    }

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
  }

  async get(_key: string): Promise<ImageStorageRecord | undefined> {
    // In Supabase mode the SPA loads images directly from the signed URL, so the API
    // does not proxy bytes (the /v1/images route is unused in this mode).
    void _key;
    return undefined;
  }

  async getUrl(key: string): Promise<string | undefined> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(key, this.signedUrlTtl);

    // Do not throw: callers fall back to the URL passed at save() time.
    if (error || !data) {
      return undefined;
    }

    return data.signedUrl;
  }
}
