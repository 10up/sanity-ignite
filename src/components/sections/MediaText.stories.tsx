import type { Meta, StoryObj } from '@storybook/react';
import MediaTextSection from './MediaText';

const meta: Meta<typeof MediaTextSection> = {
  title: 'Sections/MediaText',
  component: MediaTextSection,
  argTypes: {
    section: {
      control: 'object',
      description: 'MediaText section with image, heading, and content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaTextSection>;

export const Default: Story = {
  args: {
    section: {
      _type: 'mediaText',
      heading: 'Engaging Visual Storytelling',
      content: [
        {
          _key: '1',
          _type: 'block',
          children: [
            {
              _type: 'span',
              _key: '1',
              text: 'Enhance your content with powerful media and text.',
            },
          ],
        },
      ],
      imagePosition: 'left',
    },
  },
};

export const ImageRight: Story = {
  args: {
    section: {
      _type: 'mediaText',
      heading: 'Media on the Right Side',
      content: [
        {
          _key: '1',
          _type: 'block',
          children: [
            { _type: 'span', _key: '1', text: 'Switch layout with an image on the right.' },
          ],
        },
      ],
      imagePosition: 'right',
    },
  },
};
