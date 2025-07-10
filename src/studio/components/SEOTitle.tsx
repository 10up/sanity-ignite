// eslint-disable-next-line import/named

import { Stack, Text } from '@sanity/ui';
import { type StringInputProps, useFormValue } from 'sanity';

const TITLE_MIN_LENGTH = 50;
const TITLE_MAX_LENGTH = 60;

const getTitleFeedback = (
  title: string,
  seoKeywords: string[],
): { text: string; color: 'green' | 'orange' | 'red' }[] => {
  const feedbackItems: { text: string; color: 'green' | 'orange' | 'red' }[] = [];

  if (!title?.trim()) {
    feedbackItems.push({
      text: 'Your title is empty. Please add some content for better SEO.',
      color: 'red',
    });
    return feedbackItems;
  }

  const titleLength = title.length;

  if (titleLength < TITLE_MIN_LENGTH) {
    feedbackItems.push({
      text: `Your title is only ${titleLength} characters long — below ${TITLE_MIN_LENGTH}.`,
      color: 'orange',
    });
  } else if (titleLength > TITLE_MAX_LENGTH) {
    feedbackItems.push({
      text: `Your title is ${titleLength} characters long — above ${TITLE_MAX_LENGTH}.`,
      color: 'red',
    });
  } else {
    feedbackItems.push({
      text: `Great! Your title length (${titleLength}) looks good for SEO.`,
      color: 'green',
    });
  }

  if (seoKeywords.length > 0) {
    const foundKeyword = seoKeywords.some((kw) => title.toLowerCase().includes(kw.toLowerCase()));
    if (!foundKeyword) {
      feedbackItems.push({
        text: 'You have defined keywords but none appear in the title.',
        color: 'red',
      });
    } else {
      feedbackItems.push({
        text: 'Your keyword is in the title. Good job!',
        color: 'green',
      });
    }
  } else {
    feedbackItems.push({
      text: 'No keywords defined. Consider adding relevant keywords for better SEO.',
      color: 'orange',
    });
  }

  return feedbackItems;
};

const SEOTitle = (props: StringInputProps) => {
  const { value, renderDefault } = props;

  // Access the parent object to get keywords from the `seoKeywords` field
  const { path } = props;
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    seoKeywords?: string[];
  };

  const keywords = parent?.seoKeywords || [];

  const feedbackItems = getTitleFeedback(value || '', keywords);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <Stack space={2}>
        {feedbackItems.map((item) => (
          <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
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
