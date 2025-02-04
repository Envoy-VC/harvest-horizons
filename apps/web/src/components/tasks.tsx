import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { world } from '~/game/state';
import { IconButton } from './ui/icon-button';

export const TasksButton = observer(() => {
  const [open, setOpen] = useState<boolean>(false);

  const onOpenChange = (open: boolean) => {
    if (open) {
      setOpen(true);
      world.disableKeyboardInteractions();
    } else {
      setOpen(false);
      world.enableKeyboardInteractions();
    }
  };
  return (
    <div className='absolute top-4 right-36'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger>
          <IconButton icon='cart-button' className='h-10 w-10' />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
});
