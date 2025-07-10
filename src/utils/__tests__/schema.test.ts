import { describe, expect, it } from 'vitest';
import { createRadioListLayout } from '../schema';

describe('createRadioListLayout', () => {
  it('should transform string items into objects with formatted titles', () => {
    const items = ['first-item', 'second-item'];
    const result = createRadioListLayout(items);

    expect(result).toEqual({
      layout: 'radio',
      list: [
        { title: 'First Item', value: 'first-item' },
        { title: 'Second Item', value: 'second-item' },
      ],
    });
  });

  it('should keep object items unchanged', () => {
    const items = [{ title: 'Custom Title', value: 'custom-value' }];
    const result = createRadioListLayout(items);

    expect(result).toEqual({
      layout: 'radio',
      list: [{ title: 'Custom Title', value: 'custom-value' }],
    });
  });

  it('should merge object and string options', () => {
    const items = ['string-item', { title: 'Object Title', value: 'object-value' }];
    const options = { direction: 'horizontal' } as const;
    const result = createRadioListLayout(items, options);

    expect(result).toEqual({
      layout: 'radio',
      list: [
        { title: 'String Item', value: 'string-item' },
        { title: 'Object Title', value: 'object-value' },
      ],
      direction: 'horizontal',
    });
  });
});
