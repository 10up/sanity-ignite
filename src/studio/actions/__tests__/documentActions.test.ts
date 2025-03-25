import { describe, it, expect } from 'vitest';
import type { DocumentActionComponent, DocumentActionsContext } from 'sanity';

import { documentActions } from '../documentActions';

const mockInput = [
  { action: 'publish' },
  { action: 'delete' },
  { action: 'discardChanges' },
  { action: 'restore' },
  { action: 'duplicate' },
] as unknown as DocumentActionComponent[];

describe('documentActions', () => {
  const mockContext: DocumentActionsContext = {
    schemaType: 'settings',
  } as DocumentActionsContext;

  it('returns only allowed singleton actions for singleton types', () => {
    const result = documentActions(mockInput, mockContext);
    const resultActions = result.map((a) => a.action);
    expect(resultActions).toEqual(['publish', 'discardChanges', 'restore']);
  });

  it('returns all actions for non-singleton types', () => {
    const result = documentActions(mockInput, {
      schemaType: 'regularType',
    } as DocumentActionsContext);
    const resultActions = result.map((a) => a.action);
    expect(resultActions).toEqual(['publish', 'delete', 'discardChanges', 'restore', 'duplicate']);
  });
});
