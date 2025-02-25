import { StringInputProps, useFormValue } from 'sanity';
import { Stack, Text } from '@sanity/ui';

const SEODescriptionFeedback = (props: StringInputProps) => {
  const { value, renderDefault } = props;

  const { path } = props;
  const parentPath = path.slice(0, -1);
  const parent = useFormValue(parentPath) as {
    metaDescription?: string;
  };

  const description = parent?.metaDescription || '';

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
    // 1. Check if the description is empty
    if (!metaDescription || !metaDescription.trim()) {
      return {
        text: 'No meta description has been specified. Search engines will display copy from the page instead. Make sure to write one!',
        color: 'red',
      };
    }

    // 2. Measure description length
    const charCount = metaDescription.trim().length;
    const minLength = 100;
    const maxLength = 160;

    // 3. Check if too short
    if (charCount < minLength) {
      return {
        text: `The meta description is too short at ${charCount} characters. You have up to ${maxLength} characters to use — make the most of it!`,
        color: 'orange',
      };
    }

    // 4. Check if too long
    if (charCount > maxLength) {
      return {
        text: `The meta description is too long at ${charCount} characters. It may get truncated in search results. Try keeping it under ${maxLength}.`,
        color: 'red',
      };
    }

    // 5. If it’s within recommended range, give a thumbs up
    return {
      text: 'Well done! Your meta description length looks good for SEO.',
      color: 'green',
    };
  };

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
        <Text weight="bold" muted size={1}>
          Meta description length: {text}
        </Text>
      </div>
    </Stack>
  );
};

export default SEODescriptionFeedback;
