import { Injectable } from '@nestjs/common';

export interface StoredImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
}

export abstract class ImageStorage {
  abstract save(key: string, image: StoredImage): void;
  abstract get(key: string): StoredImage | undefined;
}

@Injectable()
export class InMemoryImageStorage implements ImageStorage {
  private readonly images = new Map<string, StoredImage>();

  save(key: string, image: StoredImage): void {
    this.images.set(key, image);
  }

  get(key: string): StoredImage | undefined {
    return this.images.get(key);
  }
}
