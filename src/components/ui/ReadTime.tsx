import { Clock } from 'lucide-react';
import { readTime } from '@/utils/strings';

export function ReadTime({ wordCount }: { wordCount: number }) {
  return (
    <div className="flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4 mr-1" />
      {readTime(wordCount)} minute
      {readTime(wordCount) > 1 ? 's' : ''}
    </div>
  );
}
