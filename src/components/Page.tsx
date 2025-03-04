import { Page as PageType } from '@/sanity.types';
import PageSections from './PageSections';
import Main from './layout/Main';

export default function Page({ pageSections }: { pageSections: PageType['pageSections'] }) {
  return (
    <Main>
      <PageSections sections={pageSections} />
    </Main>
  );
}
