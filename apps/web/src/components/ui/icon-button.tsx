import type { ComponentProps } from 'react';

import { cn } from '~/lib/utils';

interface IconButtonProps extends ComponentProps<'button'> {
  innerClassName?: string;
  icon: string;
}

export const IconButton = ({
  className,
  type = 'button',
  icon,
  ...props
}: IconButtonProps) => {
  const imgUrl = `/assets/ui/${icon}.png`;

  return (
    <button
      // eslint-disable-next-line react/button-has-type -- safe
      type={type}
      className={cn(
        '!shadow-2xl h-8 w-8 cursor-pointer hover:translate-y-1',
        className
      )}
      {...props}
    >
      {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
      <img alt={icon} className='h-full w-full' src={imgUrl} />
      <span className='sr-only'>{icon}</span>
    </button>
  );
};
