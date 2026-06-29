// eslint-disable-next-line import/named

import { Stack, Text } from '@sanity/ui';
import type { StringInputProps } from 'sanity';

const TITLE_MIN_LENGTH = 50;
const TITLE_MAX_LENGTH = 60;

const getTitleFeedback = (
  title: string
): { text: string; color: 'green' | 'orange' | 'red' }[] => {
  if (!title?.trim()) {
    return [
      {
        text: 'Your title is empty. Please add some content for better SEO.',
        color: 'red',
      },
    ];
  }

  const titleLength = title.length;

  if (titleLength < TITLE_MIN_LENGTH) {
    return [
      {
        text: `Your title is only ${titleLength} characters long — below ${TITLE_MIN_LENGTH}.`,
        color: 'orange',
      },
    ];
  }

  if (titleLength > TITLE_MAX_LENGTH) {
    return [
      {
        text: `Your title is ${titleLength} characters long — above ${TITLE_MAX_LENGTH}.`,
        color: 'red',
      },
    ];
  }

  return [
    {
      text: `Great! Your title length (${titleLength}) looks good for SEO.`,
      color: 'green',
    },
  ];
};

const SEOTitle = (props: StringInputProps) => {
  const { value, renderDefault } = props;

  const feedbackItems = getTitleFeedback(value || '');

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Stack space={2}>
        {feedbackItems.map((item) => (
          <div
            key={item.text}
            style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: item.color,
              }}
            />
            <Text weight="semibold" muted size={1}>
              {item.text}
            </Text>
          </div>
        ))}
      </Stack>
    </Stack>
  );
};

export default SEOTitle;
