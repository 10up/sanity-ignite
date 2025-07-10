import type { PortableTextBlock } from 'next-sanity';
import { Image } from 'next-sanity/image';
import CustomPortableText from '@/components/modules/PortableText';
import { Badge } from '@/components/ui/Badge';
import { urlForImage } from '@/lib/sanity/client/utils';
import type { PersonFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function PersonArchiveByline({ person }: { person: PersonFragmentType }) {
  return (
    <div className="mb-12">
      <div className="flex flex-col items-center md:items-start md:flex-row gap-8 md:gap-12">
        <div className="relative max-w-[300px] w-full h-[300px]">
          {person.image ? (
            <Image
              src={urlForImage(person.image)?.width(800).height(800).url() as string}
              alt={`Photo of ${person.firstName} ${person.lastName}`}
              style={{
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              width={800}
              height={800}
              className="rounded-full object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-col justify-center w-full">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {person.firstName} {person.lastName}
            </h1>
            {person.role ? <Badge>{person.role}</Badge> : null}
          </div>
          {person.biography ? (
            <CustomPortableText value={person.biography as PortableTextBlock[]} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
