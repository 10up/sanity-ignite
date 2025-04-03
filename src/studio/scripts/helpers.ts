import { faker } from '@faker-js/faker';
import type { SanityClient } from 'sanity';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  onRetry?: (error: Error, attempt: number) => void;
}
export async function retryPromise<T>(
  promiseFn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries = 3, initialDelay = 1000, maxDelay = 30000, onRetry } = options;

  for (let attempts = 0; attempts < maxRetries; attempts++) {
    try {
      return await promiseFn();
    } catch (error) {
      const isLastAttempt = attempts === maxRetries - 1;
      if (isLastAttempt) {
        throw error instanceof Error ? error : new Error('Promise retry failed');
      }

      const normalizedError = error instanceof Error ? error : new Error('Unknown error');

      if (onRetry) {
        onRetry(normalizedError, attempts + 1);
      }

      const backoffDelay = Math.min(initialDelay * 2 ** attempts, maxDelay);

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
    }
  }

  throw new Error('Promise retry failed');
}

export type ImageType = 'heroSection' | 'mediaTextSection' | 'person';

export interface ImageOptions {
  width?: number;
  height?: number;
  url?: string;
  type: ImageType;
}

const DEFAULT_IMAGE_CONFIG = {
  width: 1000,
  height: 667,
  blur: 0,
  grayscale: false,
} as const;

function getImageUrl({ width, height, type }: Partial<ImageOptions>): string {
  if (type === 'person') {
    return faker.image.personPortrait();
  }

  return faker.image.urlPicsumPhotos({
    width: width ?? DEFAULT_IMAGE_CONFIG.width,
    height: height ?? DEFAULT_IMAGE_CONFIG.height,
    blur: DEFAULT_IMAGE_CONFIG.blur,
    grayscale: DEFAULT_IMAGE_CONFIG.grayscale,
  });
}

async function fetchImageBuffer(url: string): Promise<ArrayBuffer> {
  return fetch(url).then((res) => res.arrayBuffer());
}

async function uploadImageToSanity(client: SanityClient, buffer: ArrayBuffer) {
  return client.assets.upload('image', Buffer.from(buffer), {
    title: faker.lorem.words(3),
  });
}

export interface ImageAsset {
  id: string;
  type: ImageType;
}

export async function generateImage(
  client: SanityClient,
  { width, height, url, type }: ImageOptions,
): Promise<ImageAsset> {
  const imageUrl = url ?? getImageUrl({ width, height, type });
  const imageBuffer = await fetchImageBuffer(imageUrl);
  const imageAsset = await uploadImageToSanity(client, imageBuffer);

  return {
    id: imageAsset._id,
    type,
  };
}
