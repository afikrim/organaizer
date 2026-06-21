import { Injectable } from '@nestjs/common';

export interface StoredImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export abstract class ImageStorage {
  abstract save(key: string, image: StoredImage, imageUrl: string): Promise<void>;
  abstract get(key: string): Promise<StoredImage | undefined>;
  abstract getUrl(key: string): Promise<string | undefined>;
}

@Injectable()
export class InMemoryImageStorage implements ImageStorage {
  private readonly images = new Map<string, StoredImage>();
  private readonly urls = new Map<string, string>();

  async save(key: string, image: StoredImage, imageUrl: string): Promise<void> {
    this.images.set(key, image);
    this.urls.set(key, imageUrl);
  }

  async get(key: string): Promise<StoredImage | undefined> {
    return this.images.get(key);
  }

  async getUrl(key: string): Promise<string | undefined> {
    return this.urls.get(key);
  }
}
