import { Person } from '@/sanity.types';

export default function Author({ author }: { author: Pick<Person, 'firstName' | 'lastName'> }) {
  return (
    <div>
      {author.firstName} {author.lastName}
    </div>
  );
}
