import { Injectable } from '@nestjs/common';

export interface StoredImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export interface ImageStorageRecord extends StoredImage {
  sessionId: string;
}

export abstract class ImageStorage {
  abstract save(
    key: string,
    image: StoredImage,
    imageUrl: string,
    sessionId: string,
  ): Promise<void>;
  abstract get(key: string): Promise<ImageStorageRecord | undefined>;
  abstract getUrl(key: string): Promise<string | undefined>;
}

@Injectable()
export class InMemoryImageStorage implements ImageStorage {
  private readonly images = new Map<string, ImageStorageRecord>();
  private readonly urls = new Map<string, string>();

  async save(
    key: string,
    image: StoredImage,
    imageUrl: string,
    sessionId: string,
  ): Promise<void> {
    this.images.set(key, { ...image, sessionId });
    this.urls.set(key, imageUrl);
  }

  async get(key: string): Promise<ImageStorageRecord | undefined> {
    return this.images.get(key);
  }

  async getUrl(key: string): Promise<string | undefined> {
    return this.urls.get(key);
  }
}
