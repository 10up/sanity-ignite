import type { Meta, StoryObj } from '@storybook/react';
import Divider from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Sections/Divider',
  component: Divider,
  argTypes: {
    section: {
      control: 'object',
      description: 'Divider section with configurable height',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    section: {
      height: 1,
    },
  },
};

export const CustomHeight: Story = {
  args: {
    section: {
      height: 10,
    },
  },
};
