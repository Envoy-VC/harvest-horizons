import * as React from 'react';

import { cn } from '~/lib/utils';

import * as SliderPrimitive from '@radix-ui/react-slider';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className='relative h-1.5 w-full grow overflow-hidden rounded-full bg-[#6b505280]'>
      <SliderPrimitive.Range className='absolute h-full bg-[#6B5052]' />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className='disabled:pointer-events-none disabled:opacity-50'>
      {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
      <img
        src='/assets/ui/box-square.png'
        alt='Thumb'
        className='max-h-8 min-h-8 min-w-8 max-w-8 cursor-pointer'
      />
    </SliderPrimitive.Thumb>
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
