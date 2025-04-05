import { slugify } from '@/utils/strings';
import { faker } from '@faker-js/faker';
import { PromisePool } from '@supercharge/promise-pool';
import {
  createFakeBlockContent,
  generateImage,
  generatePageTitle,
  ImageAsset,
  ImageOptions,
  retryPromise,
} from './helpers';
import { SanityClient } from 'sanity';

// Image asset configurations
const IMAGE_ASSETS_CONFIG: ImageOptions[] = [
  {
    type: 'heroSection',
    url: 'https://cdn.sanity.io/images/zaacf1hp/production/5fbb6233dd7f0ea709ff3f9b47b73526b410f8bd-4076x2712.jpg',
  },
  {
    type: 'mediaTextSection',
    url: 'https://cdn.sanity.io/images/zaacf1hp/production/80be44698f857e27013261cc417ff1cef1bd7053-6000x4000.jpg',
  },
  { type: 'person' },
  { type: 'person' },
  { type: 'post', height: 720, width: 1280 },
  { type: 'post', height: 720, width: 1280 },
  { type: 'post', height: 720, width: 1280 },
];

// Generates the images store that will be used by the rest of the script
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

type ImagesStore = Awaited<ReturnType<typeof generateAndUploadMockImages>>;

function generateHeroSection(imagesStore: ImagesStore) {
  const image = imagesStore.find((img) => img.type === 'heroSection')!;
  return {
    _key: faker.string.uuid(),
    _type: 'hero',
    buttons: [
      {
        _key: faker.string.uuid(),
        _type: 'button',
        text: 'Sign Up',
        variant: 'default',
      },
      {
        _key: faker.string.uuid(),
        _type: 'button',
        text: 'Learn More',
        variant: 'outline',
      },
    ],
    heading: 'Welcome to Sanity Ignite',
    image: {
      _type: 'image',
      asset: {
        _ref: image.id,
        _type: 'reference',
      },
      alt: 'The hands of a person typing on a computer',
    },
    text: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
  };
}

function generateDividerSection() {
  return {
    _key: faker.string.uuid(),
    _type: 'divider',
    height: 1,
  };
}

function generateMediaAndTextSection(imagesStore: ImagesStore) {
  const image = imagesStore.find((img) => img.type === 'mediaTextSection')!;
  return {
    _key: faker.string.uuid(),
    _type: 'mediaText',
    content: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),
    heading: 'Content Velocity',
    image: {
      _type: 'image',
      asset: {
        _ref: image.id,
        _type: 'reference',
      },
      alt: 'Woman writing content',
    },
    imagePosition: 'left',
  };
}

function generateSubscribeSection() {
  return {
    _key: faker.string.uuid(),
    _type: 'subscribe',
    buttonText: 'Sign Up',
    content: [
      {
        _key: faker.string.uuid(),
        _type: 'block',
        children: [
          {
            _key: faker.string.uuid(),
            _type: 'span',
            marks: [],
            text: 'Sign up to get the latest updates on Sanity Ignite.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
    heading: 'Subscribe to Get Updates',
  };
}

function generateCardGridSection() {
  return {
    _key: faker.string.uuid(),
    _type: 'cardGrid',
    cards: [
      {
        _key: faker.string.uuid(),
        _type: 'card',
        content: createFakeBlockContent({
          maxParagraphs: 1,
          minParagraphs: 1,
        }),

        heading: 'Lightning Fast',
      },
      {
        _key: faker.string.uuid(),
        _type: 'card',
        content: createFakeBlockContent({
          maxParagraphs: 1,
          minParagraphs: 1,
        }),

        heading: 'Modern UI Components',
      },
      {
        _key: faker.string.uuid(),
        _type: 'card',
        content: createFakeBlockContent({
          maxParagraphs: 1,
          minParagraphs: 1,
        }),

        heading: 'Customizable Schema',
      },
    ],
    content: createFakeBlockContent({
      maxParagraphs: 1,
      minParagraphs: 1,
    }),

    heading: 'More Features, Faster',
  };
}

function generatePostsListSection() {
  return {
    _key: faker.string.uuid(),
    _type: 'postList',
    heading: 'Recent Posts',
    numberOfPosts: 3,
  };
}

export function generateMockHomePage(imagesStore: ImagesStore) {
  const pageSections = [
    generateHeroSection(imagesStore),
    generateDividerSection(),
    generateMediaAndTextSection(imagesStore),
    generateSubscribeSection(),
    generateCardGridSection(),
    generatePostsListSection(),
  ];

  const seoTitle = 'Sanity Ignite by 10up';
  const seoDescription =
    'Sanity Ignite is a powerful framework for building a Sanity website in Next.js, React, and Tailwind.';

  return {
    _id: 'homePage',
    _type: 'homePage',
    name: 'Home Page',
    pageSections,
    seo: {
      _type: 'seoMetaFields',
      metaDescription: seoDescription,
      metaTitle: seoTitle,
      noIndex: true,
      openGraph: {
        _type: 'openGraph',
        description: seoDescription,
        title: seoTitle,
      },
    },
  };
}

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

export function generateMockPeople(imagesStore: ImagesStore) {
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

type MockPeopleType = ReturnType<typeof generateMockPeople>[number];

type MockCategoryType = ReturnType<typeof generateMockCategories>[number];
interface PostGenerationOptions {
  imagesStore: ImagesStore;
  authors: MockPeopleType[];
  categories: MockCategoryType[];
}

export function generateMockPosts({ imagesStore, authors, categories }: PostGenerationOptions) {
  const length = faker.number.int({ min: 4, max: 6 });
  const postImages = imagesStore.filter((image) => image.type === 'post');

  return Array.from({ length }).map(() => {
    const title = generatePageTitle();
    const image = faker.helpers.arrayElement(postImages);
    const author = faker.helpers.arrayElement(authors);
    const category = faker.helpers.arrayElement(categories);

    return {
      _id: faker.string.uuid(),
      _type: 'post',
      title,
      slug: {
        type: 'slug',
        current: slugify(title),
      },
      image: {
        _type: 'image',
        asset: {
          _ref: image.id,
          _type: 'reference',
        },
        alt: faker.lorem.words(6),
      },
      content: createFakeBlockContent({
        minParagraphs: 9,
        maxParagraphs: 15,
        rich: true,
      }),
      excerpt: faker.lorem.paragraph(),
      categories: [
        {
          _key: faker.string.uuid(),
          _ref: category._id,
          _type: 'reference',
        },
      ],
      date: new Date(faker.date.past()).toISOString(),
      author: {
        _type: 'reference',
        _ref: author._id,
      },
      seo: {
        noIndex: false,
        _type: 'seoMetaFields',
      },
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
