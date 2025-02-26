import { Person } from '@/sanity.types';
import * as v from 'valibot';

const propSchema = v.object({
  firstName: v.string(),
  lastName: v.string(),
});

export default function Author({ author }: { author: Person }) {
  const result = v.safeParse(propSchema, author);

  if (!result.success) {
    return null;
  }

  return (
    <div>
      {author.firstName} {author.lastName}
    </div>
  );
}
