import { PageSections as PageSectionsType } from '../types/page';
import Hero from './sections/Hero';
import CTA from './sections/CTA';
import MediaText from './sections/MediaText';
import PostList from './sections/PostList';

export default function PageSections({ sections }: { sections: PageSectionsType }) {
  return sections?.map((section) => {
    switch (section._type) {
      case 'hero':
        return <Hero key={section._key} section={section} />;
      case 'mediaText':
        return <MediaText key={section._key} section={section} />;
      case 'cta':
        return <CTA key={section._key} section={section} />;
      case 'postList':
        return <PostList key={section._key} section={section} />;
      default:
        return null;
    }
  });
}
