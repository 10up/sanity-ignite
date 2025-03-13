import { Page as PageType } from '@/sanity.types';
import PageSections from './PageSections';

export default function Page({ pageSections }: { pageSections: PageType['pageSections'] }) {
  return <PageSections sections={pageSections} />;
}
