import { stegaClean } from 'next-sanity';
import { Image } from 'next-sanity/image';

import { urlForImage } from '@/lib/sanity/client/utils';

interface CoverImageProps {
  image: { asset?: { _ref?: string }; alt?: string | null };
  preload?: boolean;
  sizes?: string;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, preload, sizes } = props;

  const image = source?.asset?._ref ? (
    <Image
      className="rounded-2xl shadow-md transition-shadow object-cover"
      fill={true}
      alt={stegaClean(source?.alt) || ''}
      src={
        urlForImage(source)
          ?.height(720)
          .width(1280)
          .auto('format')
          .url() as string
      }
      sizes={sizes || '100vw'}
      preload={preload}
    />
  ) : (
    <div className="bg-slate-50" style={{ paddingTop: '100%' }} />
  );

  return <div className="relative aspect-video">{image}</div>;
}
