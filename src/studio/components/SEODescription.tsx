// eslint-disable-next-line import/named

import { Stack, Text } from '@sanity/ui';
import { type StringInputProps, useFormValue } from 'sanity';

const META_DESCRIPTION_MIN_LENGTH = 100;
const META_DESCRIPTION_MAX_LENGTH = 160;

/**
 * Returns feedback about a page’s meta description based on Yoast SEO-style best practices.
 *
 * Typical guidance:
 * - Write *some* description (don’t leave it empty).
 * - Aim for roughly 100–160 characters.
 * - If it’s under ~100, it’s likely too short.
 * - If it’s over ~160, it might get truncated in search engine results.
 */
const getDescriptionFeedback = (metaDescription: string): { text: string; color: string } => {
  if (!metaDescription || !metaDescription.trim()) {
    return {
      text: 'No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!',
      color: 'red',
    };
  }

  const metaDescriptionLength = metaDescription.trim().length;

  if (metaDescriptionLength < META_DESCRIPTION_MIN_LENGTH) {
    return {
      text: `The meta description is too short at ${metaDescriptionLength} characters. You have up to ${META_DESCRIPTION_MAX_LENGTH} characters to use — make the most of it!`,
      color: 'orange',
    };
  }

  if (metaDescriptionLength > META_DESCRIPTION_MAX_LENGTH) {
    return {
      text: `The meta description is too long at ${metaDescriptionLength} characters. It may get truncated in search results. Try keeping it under ${META_DESCRIPTION_MAX_LENGTH}.`,
      color: 'red',
    };
  }

  return {
    text: 'Well done! Your meta description length looks good for SEO.',
    color: 'green',
  };
};

const SEODescription = (props: StringInputProps) => {
  const { value, renderDefault } = props;

  // Access the parent object to get keywords from the `seoKeywords` field
  const { path } = props;
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    metaDescription?: string;
  };

  const description = parent?.metaDescription || '';
  const { text, color } = getDescriptionFeedback(value || description);

  return (
    <Stack space={3}>
      {renderDefault(props)}
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ minWidth: '15px' }}>
          <div
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: color,
              borderRadius: '50%',
            }}
          />
        </div>
        <Text weight="semibold" muted size={1}>
          {text}
        </Text>
      </div>
    </Stack>
  );
};

export default SEODescription;
