import type { Meta, StoryObj } from '@storybook/react';
import HeroSection from './Hero';

const meta: Meta<typeof HeroSection> = {
  title: 'Sections/Hero',
  component: HeroSection,
  argTypes: {
    section: {
      control: 'object',
      description: 'Hero section with heading, text, image, and buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {
  args: {
    section: {
      _key: '1',
      _type: 'hero',
      heading: 'Welcome to Our Platform',
      text: [
        {
          _type: 'block',
          _key: '1',
          children: [
            {
              _key: '1',
              _type: 'span',
              text: 'Discover new opportunities with our services.',
              marks: [],
            },
          ],
        },
      ],
      buttons: [
        {
          _type: 'button',
          _key: '1',
          text: 'Get Started',
          link: {
            _type: 'link',
            type: 'internal',
            external: null,
            internal: { _type: 'page', _id: '1', slug: 'get-started' },
            openInNewTab: false,
          },
          variant: 'default',
        },
        {
          _type: 'button',
          _key: '2',
          text: 'Learn More',
          link: {
            _type: 'link',
            type: 'internal',
            external: null,
            internal: { _type: 'page', _id: '1', slug: 'learn-more' },
            openInNewTab: false,
          },
          variant: 'outline',
        },
      ],
    },
  },
};

export const WithoutButtons: Story = {
  args: {
    section: {
      _key: '1',
      _type: 'hero',
      heading: 'Welcome to Our Platform',
      text: [
        {
          _type: 'block',
          _key: '1',
          children: [
            {
              _key: '1',
              _type: 'span',
              text: 'Discover new opportunities with our services.',
              marks: [],
            },
          ],
        },
      ],
      buttons: [],
    },
  },
};
