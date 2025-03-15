import { Clock } from 'lucide-react';
import { readTime } from '@/utils/strings';
import { toPlainText, type PortableTextBlock } from 'next-sanity';

export default function ReadTime({ content }: { content: PortableTextBlock[] }) {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4 mr-1" />
      {readTime(toPlainText(content || []))} minute
      {readTime(toPlainText(content || [])) > 1 ? 's' : ''}
    </div>
  );
}
