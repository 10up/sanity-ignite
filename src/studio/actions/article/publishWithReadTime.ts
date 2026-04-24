import { useState } from 'react';
import { type DocumentActionProps, useDocumentOperation } from 'sanity';

const WORDS_PER_MINUTE = 200;

type Block = {
  _type: string;
  children?: Array<{ text?: string }>;
};

function calculateReadTime(blocks: Block[]): number {
  const wordCount = blocks
    .filter((b) => b._type === 'block')
    .flatMap((b) => b.children ?? [])
    .map((child) => child.text ?? '')
    .join(' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

export function PublishWithReadTimeAction(props: DocumentActionProps) {
  const { patch, publish } = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);

  return {
    disabled: Boolean(publish.disabled),
    label: isPublishing ? 'Publishing…' : 'Publish',
    onHandle: () => {
      const blocks = (props.draft?.content ?? []) as Block[];
      patch.execute([{ set: { readTime: calculateReadTime(blocks) } }]);
      publish.execute();
      setIsPublishing(true);
    },
  };
}
