import { Page } from '@/sanity.types';
import Hero from './sections/Hero';
import CTA from './sections/CTA';
import MediaText from './sections/MediaText';
import PostList from './sections/PostList';
import CardGrid from './sections/CardGrid';
import Divider from './sections/Divider';
import Subscribe from './sections/Subscribe';

export default function PageSections({ sections }: { sections: Page['pageSections'] }) {
  return sections?.map((section) => {
    switch (section._type) {
      case 'hero':
        return <Hero key={section._key} section={section} />;
      case 'mediaText':
        return <MediaText key={section._key} section={section} />;
      case 'cta':
        return <CTA key={section._key} section={section} />;
      case 'subscribe':
        return <Subscribe key={section._key} section={section} />;
      case 'postList':
        return <PostList key={section._key} section={section} />;
      case 'cardGrid':
        return <CardGrid key={section._key} section={section} />;
      case 'divider':
        return <Divider key={section._key} section={section} />;
      default:
        return null;
    }
  });
}
