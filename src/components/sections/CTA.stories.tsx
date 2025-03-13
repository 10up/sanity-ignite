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
      _type: 'cta',
      heading: 'Get Started Today',
      text: 'Join us now and explore amazing opportunities.',
      buttons: [
        {
          _type: 'button',
          _key: '1',
          text: 'Sign Up',
          url: { _type: 'customUrl', href: '/sign-up' },
          variant: 'default',
        },
        {
          _type: 'button',
          _key: '2',
          text: 'Learn More',
          url: { _type: 'customUrl', href: '/learn-more' },
          variant: 'outline',
        },
      ],
    },
  },
};

export const NoButtons: Story = {
  args: {
    section: {
      _type: 'cta',
      heading: 'Limited Time Offer!',
      text: 'Don’t miss out on our special deal available for a short time.',
      buttons: [],
    },
  },
};
