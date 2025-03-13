import type { Meta, StoryObj } from '@storybook/react';
import CtaSection from './CTA';

const meta: Meta<typeof CtaSection> = {
  title: 'Sections/CTA',
  component: CtaSection,
  argTypes: {
    section: {
      control: 'object',
      description: 'CTA section content including heading, text, and buttons',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CtaSection>;

export const Default: Story = {
  args: {
    section: {
      _key: '1',
      _type: 'cta',
      heading: 'Get Started Today',
      text: 'Join us now and explore amazing opportunities.',
      buttons: [
        {
          _type: 'button',
          _key: '1',
          text: 'Sign Up',
          link: {
            _type: 'link',
            type: 'internal',
            external: null,
            internal: { _type: 'page', _id: '1', slug: 'sign-up' },
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

export const NoButtons: Story = {
  args: {
    section: {
      _key: '1',
      _type: 'cta',
      heading: 'Limited Time Offer!',
      text: 'Don’t miss out on our special deal available for a short time.',
      buttons: [],
    },
  },
};
