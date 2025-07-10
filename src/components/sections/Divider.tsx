import type { DividerSectionFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function Divider({ section: { height } }: { section: DividerSectionFragmentType }) {
  return (
    <div className="py-10   md:py-14">
      <div className="container mx-auto px-4">
        <div
          className={'w-full h-px bg-gray-200 relative'}
          style={height ? { height: `${height}px` } : undefined}
        >
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
