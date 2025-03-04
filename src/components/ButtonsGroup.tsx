import { Button as ButtonType } from '@/sanity.types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export default function ButtonsGroup({
  buttons,
  size = 'xl',
  className,
}: {
  buttons: Array<{ _key: string } & ButtonType>;
  size?: 'xl' | 'lg' | 'sm' | 'default' | 'icon';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-4', className)}>
      {buttons.map((button) => (
        <Button variant={button.variant} size={size} key={button._key}>
          {button.text}
        </Button>
      ))}
    </div>
  );
}
