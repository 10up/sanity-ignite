import { useFormValue, StringInputProps } from 'sanity';
import React from 'react';
import { Stack, Text } from '@sanity/ui';

const SEOTitleFeedback = (props: StringInputProps) => {
  const { value, renderDefault } = props;

  // Access the parent object to get keywords from the `seoKeywords` field
  const { path } = props;
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    seoKeywords?: string[];
  };

  const keywords = parent?.seoKeywords || [];

  /**
   * Returns an array of feedback items.
   * Each item has its own text + color for an individual bullet.
   */
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

    const charCount = title.length;
    const minChar = 50;
    const maxChar = 60;

    // 1) Title length check
    if (charCount < minChar) {
      feedbackItems.push({
        text: `Your title is only ${charCount} characters long — below ${minChar}.`,
        color: 'orange',
      });
    } else if (charCount > maxChar) {
      feedbackItems.push({
        text: `Your title is ${charCount} characters long — above ${maxChar}.`,
        color: 'red',
      });
    } else {
      feedbackItems.push({
        text: `Great! Your title length (${charCount}) looks good for SEO.`,
        color: 'green',
      });
    }

    // 2) Keyword usage check
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

  // Get an array of feedback items for the current title
  const feedbackItems = getTitleFeedback(value || '', keywords);

  return (
    <Stack space={3}>
      {/* Default input field */}
      {renderDefault(props)}

      {/* Map over feedback items, each with its own color-coded bullet */}
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

export default SEOTitleFeedback;
