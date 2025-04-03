import { slugify } from '@/utils/strings';
import { faker } from '@faker-js/faker';
import { PromisePool } from '@supercharge/promise-pool';
import { generateImage, ImageAsset, ImageOptions, retryPromise } from './helpers';
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
  //   {
  //     type: 'og' as const,
  //     url: 'https://raw.githubusercontent.com/robotostudio/turbo-start-sanity/refs/heads/main/turbo-start-sanity-og.png',
  //   },
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
      alt: `The hands of a person typing on a computer`,
    },
    text: [
      {
        _key: faker.string.uuid(),
        _type: 'block',
        children: [
          {
            _key: faker.string.uuid(),
            _type: 'span',
            marks: [],
            text: 'A headstart on building a powerful website with Sanity.io complete with TypeScript, Next.js, and Tailwind.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
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
    content: [
      {
        _key: faker.string.uuid(),
        _type: 'block',
        children: [
          {
            _key: faker.string.uuid(),
            _type: 'span',
            marks: [],
            text: 'Quickly draft and publish content with instant previews of what your working on. Empower your editors to move quickly.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
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
        content: [
          {
            _key: faker.string.uuid(),
            _type: 'block',
            children: [
              {
                _key: faker.string.uuid(),
                _type: 'span',
                marks: [],
                text: 'Performance oriented schema. Optimized for caching in Next.js to improve user experience and SEO.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        heading: 'Lightning Fast',
      },
      {
        _key: faker.string.uuid(),
        _type: 'card',
        content: [
          {
            _key: faker.string.uuid(),
            _type: 'block',
            children: [
              {
                _key: faker.string.uuid(),
                _type: 'span',
                marks: [],
                text: 'Beautiful, responsive components built with Tailwind CSS that you can easily customize.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        heading: 'Modern UI Components',
      },
      {
        _key: faker.string.uuid(),
        _type: 'card',
        content: [
          {
            _key: faker.string.uuid(),
            _type: 'block',
            children: [
              {
                _key: faker.string.uuid(),
                _type: 'span',
                marks: [],
                text: 'Define your content structure with a flexible and intuitive schema that adapts to your specific needs.',
              },
            ],
            markDefs: [],
            style: 'normal',
          },
        ],
        heading: 'Customizable Schema',
      },
    ],
    content: [
      {
        _key: faker.string.uuid(),
        _type: 'block',
        children: [
          {
            _key: '0a608e69f3d0',
            _type: 'span',
            marks: [],
            text: 'Build and iterate on features quicker without having to deal with project architecture and configuration.',
          },
        ],
        markDefs: [],
        style: 'normal',
      },
    ],
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

  return {
    _id: 'homePage',
    _type: 'homePage',
    name: 'Home Page',
    pageSections,
    seo: {
      _type: 'seoMetaFields',
      metaDescription:
        'Sanity Ignite is a powerful framework for building a Sanity website in Next.js, React, and Tailwind.',
      metaTitle: 'Sanity Ignite by 10up',
      noIndex: true,
      openGraph: {
        _type: 'openGraph',
        description:
          'Sanity Ignite is a powerful framework for building a Sanity website in Next.js, React, and Tailwind.',
        title: 'Sanity Ignite by 10up',
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
