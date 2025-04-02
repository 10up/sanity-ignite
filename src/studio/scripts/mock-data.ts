import { slugify } from '@/utils/strings';
import { faker } from '@faker-js/faker';
import { PromisePool } from '@supercharge/promise-pool';
import { generateImage, ImageAsset, retryPromise } from './helpers';
import { SanityClient } from 'sanity';

export function generateMockBlogPage() {
  return {
    _id: 'blogPage',
    _type: 'blogPage',
    name: 'Blog Page',
    seo: {
      noIndex: false,
      _type: 'seoMetaFields',
    },
  };
}

// Image asset configurations
const IMAGE_ASSETS_CONFIG = [
  //   { type: 'heroBlock' as const, width: 1200, height: 1200 },
  //   { type: 'heroBlock' as const, width: 1200, height: 1200 },
  //   { type: 'slugPage' as const, width: 2560, height: 1440 },
  //   { type: 'slugPage' as const, width: 2560, height: 1440 },
  //   { type: 'slugPage' as const, width: 2560, height: 1440 },
  { type: 'person' as const },
  { type: 'person' as const },
  //   { type: 'blog' as const, width: 2560, height: 1440 },
  //   { type: 'blog' as const, width: 2560, height: 1440 },
  //   { type: 'blog' as const, width: 2560, height: 1440 },
  //   { type: 'logo' as const, url: LOGO_URL },
  //   {
  //     type: 'og' as const,
  //     url: 'https://raw.githubusercontent.com/robotostudio/turbo-start-sanity/refs/heads/main/turbo-start-sanity-og.png',
  //   },
] as const;

// Main export for image generation
export async function generateAndUploadMockImages(client: SanityClient): Promise<ImageAsset[]> {
  console.log('🎨 Starting image generation...');

  const { results } = await PromisePool.withConcurrency(2)
    .for(IMAGE_ASSETS_CONFIG)
    .process(async (asset, index) => {
      console.log(`📸 Generating image ${index + 1}/${IMAGE_ASSETS_CONFIG.length} (${asset.type})`);

      return retryPromise(async () => generateImage(client, asset), {
        onRetry(error, attempt) {
          console.log(
            `🔄 Retrying image generation attempt ${attempt} for ${asset.type}:`,
            error.message,
          );
        },
      });
    });

  console.log(`✅ Created ${results.length} images`);
  return results;
}

type ImageStore = Awaited<ReturnType<typeof generateAndUploadMockImages>>;

export function generateMockPeople(imagesStore: ImageStore) {
  // TODO: share the size between document sizes and images in a better way (e.g. 2 people = 2 people images)
  const peopleSize = 2;
  const peopleImages = imagesStore.filter((image) => image.type === 'person');

  return Array.from({ length: peopleSize }).map((_, index) => {
    const image = peopleImages[index];
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      _id: faker.string.uuid(),
      _type: 'person',
      firstName,
      lastName,
      slug: {
        type: 'slug',
        current: slugify(`${firstName} ${lastName}`),
      },
      image: {
        _type: 'image',
        asset: {
          _ref: image.id,
          _type: 'reference',
        },
        alt: `${firstName} picture`,
      },
      role: faker.person.jobTitle(),
    };
  });
}

export function generateMockCategories() {
  const categoriesSize = 3;

  return Array.from({ length: categoriesSize }).map(() => {
    const title = faker.commerce.department();

    return {
      _id: faker.string.uuid(),
      _type: 'category',
      title,
      slug: {
        type: 'slug',
        current: slugify(title),
      },
      description: faker.lorem.paragraph(2),
    };
  });
}

export function generateMockSiteSettings() {
  return {
    _id: 'siteSettings',
    _type: 'settings',
    title: 'Sanity Ignite',
    description:
      'This is a Sanity.io starter kit providing modern, clean designs for your content-driven websites.',
    menu: [
      {
        _key: faker.string.uuid(),
        _type: 'menuItem',
        link: {
          _type: 'link',
          external: '/blog',
          type: 'external',
        },
        text: 'Blog',
        type: 'link',
      },
      {
        _key: faker.string.uuid(),
        _type: 'menuItem',
        link: {
          _type: 'link',
          external: 'https://github.com/10up/sanity-ignite',
          openInNewTab: true,
          type: 'external',
        },
        text: 'GitHub',
        type: 'link',
      },
      {
        _key: faker.string.uuid(),
        _type: 'menuItem',
        childMenu: [
          {
            _key: faker.string.uuid(),
            _type: 'menuItem',
            text: 'Contact',
            type: 'link',
          },
          {
            _key: faker.string.uuid(),
            _type: 'menuItem',
            text: 'Our Team',
            type: 'link',
          },
          {
            _key: faker.string.uuid(),
            _type: 'menuItem',
            text: 'Resources',
            type: 'link',
          },
        ],
        text: 'About',
        type: 'child-menu',
      },
    ],
  };
}
