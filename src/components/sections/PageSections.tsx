import Hero from './Hero';
import CTA from './CTA';
import MediaText from './MediaText';
import PostList from './PostList';
import CardGrid from './CardGrid';
import Divider from './Divider';
import Subscribe from './Subscribe';
import { Sections } from './types';

export default function PageSections({ pageSections }: { pageSections: Sections }) {
  return pageSections?.map((section) => {
    if (!section) return null;
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
