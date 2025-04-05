import { faker } from '@faker-js/faker';
import { htmlToBlocks } from '@portabletext/block-tools';
import { Schema } from '@sanity/schema';
import type { FieldDefinition, SanityClient } from 'sanity';
import { JSDOM } from 'jsdom';
import { schemaTypes } from '../schema';
import { capitalize } from '@/utils/strings';

const defaultSchema = Schema.compile({ types: schemaTypes });
const blockContentSchema = defaultSchema
  .get('post')
  .fields.find((field: FieldDefinition) => field.name === 'content').type;

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

export type ImageType = 'heroSection' | 'mediaTextSection' | 'person' | 'post';

export interface ImageOptions {
  width?: number;
  height?: number;
  url?: string;
  type: ImageType;
}

function getImageUrl({ width, height, type }: Partial<ImageOptions>): string {
  if (type === 'person') {
    return faker.image.personPortrait();
  }

  return faker.image.urlPicsumPhotos({
    width: width ?? 1000,
    height: height ?? 667,
    blur: 0,
    grayscale: false,
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

export function generatePageTitle() {
  const length = faker.number.int({ min: 40, max: 80 });
  const names = Array.from({ length }, () => {
    const adjective = capitalize(faker.company.catchPhraseAdjective());
    const descriptor = capitalize(faker.company.catchPhraseDescriptor());
    const noun = capitalize(faker.company.catchPhraseNoun());
    return `${adjective} ${descriptor} ${noun}`;
  });
  return faker.helpers.arrayElement(names);
}

interface HTMLGeneratorOptions {
  enableLists?: boolean;
  headingLevels?: Array<'h2' | 'h3'>;
  marks?: Array<'strong' | 'em'>;
}

function generateHTML(count: number, options: HTMLGeneratorOptions = {}) {
  const { enableLists = false, headingLevels = [], marks = ['strong', 'em'] } = options;

  const formatWord = (word: string): string => {
    const randomValue = faker.number.int({ min: 1, max: 10 });
    if (randomValue > 8 && marks.length > 0) {
      const markCombinations = [
        ...marks.map((mark) => `<${mark}>${word}</${mark}>`),
        ...(marks.includes('strong') && marks.includes('em')
          ? [`<strong><em>${word}</em></strong>`]
          : []),
      ];
      return faker.helpers.arrayElement(markCombinations);
    }
    return word;
  };

  const generateParagraph = () => {
    if (headingLevels.length > 0 && faker.number.int({ min: 1, max: 10 }) > 8) {
      const level = faker.helpers.arrayElement(headingLevels);
      return `<${level}>${faker.lorem.sentence()}</${level}>`;
    }

    if (enableLists && faker.number.int({ min: 1, max: 10 }) > 8) {
      const items = faker.helpers.multiple(() => faker.lorem.sentence(), {
        count: faker.number.int({ min: 2, max: 5 }),
      });
      return `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
    }

    const paragraph = faker.lorem.paragraph();
    const formattedWords = paragraph.split(' ').map(formatWord);
    return `<p>${formattedWords.join(' ')}</p>`;
  };

  return faker.helpers.multiple(generateParagraph, { count }).join('');
}

// Create paragraphs of fake block content
export function createFakeBlockContent(
  options: {
    minParagraphs?: number;
    maxParagraphs?: number;
    rich?: boolean;
  } = {},
) {
  const { minParagraphs = 2, maxParagraphs = 5, rich = false } = options ?? {};
  const count = faker.number.int({
    min: minParagraphs,
    max: maxParagraphs,
  });
  const html = generateHTML(count, {
    enableLists: rich,
    headingLevels: rich ? ['h2', 'h3'] : [],
  });
  return htmlToBlocks(html, blockContentSchema, {
    parseHtml: (html) => new JSDOM(html).window.document,
  });
}
