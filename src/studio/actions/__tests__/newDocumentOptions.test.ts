import { describe, it, expect } from 'vitest';
import type { NewDocumentOptionsContext, TemplateItem } from 'sanity';

import { newDocumentOptions } from '../newDocumentOptions';

const mockInput: TemplateItem[] = [
  { templateId: 'settings' },
  { templateId: 'post' },
  { templateId: 'unknown-document-type' },
  { templateId: 'template-1' },
] as unknown as TemplateItem[];

const mockContext: NewDocumentOptionsContext = {
  creationContext: {
    type: 'global',
  },
} as unknown as NewDocumentOptionsContext;

describe('newDocumentOptions', () => {
  it('returns non singleton actions items', () => {
    const result = newDocumentOptions(mockInput, mockContext);
    const resultActions = result.map((a) => a.templateId);
    expect(resultActions).toEqual(['post', 'unknown-document-type', 'template-1']);
  });
});
