import { Page as PageType, HomePage } from '@/sanity.types';
import PageSections from './PageSections';
import Main from './layout/Main';
import { PageSections as PageSectionsType } from '@/types/page';

export default function Page({ page }: { page: PageType | HomePage }) {
  return (
    <Main>
      <PageSections sections={page.pageSections as PageSectionsType} />
    </Main>
  );
}
