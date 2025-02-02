import { useState } from 'react';
import { IconButton } from '../ui/icon-button';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Inventory } from './inventory';

export const MenuButton = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='absolute top-4 right-4'>
        <IconButton
          icon='menu-button'
          className='h-10 w-10'
          onClick={() => {
            setOpen(!open);
          }}
        />
      </DialogTrigger>
      <DialogContent className='background-none w-full max-w-5xl'>
        <div className='z-[49] flex h-24 w-36 translate-x-16 flex-row items-center justify-center transition-all duration-200 ease-[step(2)]'>
          {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
          <img
            alt='Arch'
            className='!z-[5] absolute h-32 w-32 object-cover'
            src='/assets/ui/frame-arch.png'
          />
          {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
          <img
            alt='Arch'
            className='!z-[6] h-20 w-20 object-cover'
            src='/assets/ui/bag.png'
          />
        </div>
        <div className='dialog-background -translate-y-10 z-[51] aspect-video h-full w-full max-w-5xl px-8 py-4'>
          <Inventory />
        </div>
      </DialogContent>
    </Dialog>
  );
};
