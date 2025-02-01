import type { ComponentProps } from 'react';
import { cn } from '~/lib/utils';

interface IconProps extends ComponentProps<'img'> {
  icon: string;
}

const Icon = ({ icon, className, alt, ...props }: IconProps) => {
  return (
    // biome-ignore lint/nursery/noImgElement: <explanation>
    <img
      src={`/assets/ui/${icon}.png`}
      className={cn('aspect-square h-8 min-h-8 w-8 min-w-8', className)}
      {...props}
      alt={alt ?? icon}
    />
  );
};

export default Icon;
