import { useLiveQuery } from 'dexie-react-hooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { clearTasks } from '~/db/actions';
import { getTasks } from '~/db/actions';
import { taskEmitter } from '~/game/emitter';
import { world } from '~/game/state';
import { Button } from './ui/button';
import { IconButton } from './ui/icon-button';

export const TasksButton = observer(() => {
  const { address } = useAccount();
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

  const tasks = useLiveQuery(() => getTasks(address ?? '0x0'));

  const onExecute = () => {
    try {
      taskEmitter.emit('start-tasks', null);
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
    }
  };

  const onClear = async () => {
    try {
      if (!address) {
        throw new Error('Please Connect your wallet');
      }
      await clearTasks(address);
    } catch (error: unknown) {
      console.log(error);
      toast.error((error as Error).message);
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
            <SheetTitle>Tasks</SheetTitle>
          </SheetHeader>
          <div className='flex h-full w-full flex-col justify-between py-4'>
            <div className='flex min-h-[92%] w-full flex-col gap-2'>
              {(tasks ?? []).map((task) => {
                let icon: string;
                if (task.status === 'pending') {
                  icon = 'pending';
                } else if (task.status === 'completed') {
                  icon = 'check';
                } else {
                  icon = 'cross';
                }
                return (
                  <div
                    key={task.id}
                    className='flex flex-row items-center justify-between gap-2 rounded-xl border-2 border-[#A85F46] px-4 pt-2'
                  >
                    <div className='text-wrap text-sm'>{task.message}</div>
                    <IconButton
                      icon={icon}
                      className='mb-2 h-8 min-h-8 w-8 min-w-8'
                    />
                  </div>
                );
              })}
            </div>
            <div className='flex flex-row items-center gap-4'>
              <Button className='h-12 w-full' onClick={onClear}>
                Clear
              </Button>
              <Button className='h-12 w-full' onClick={onExecute}>
                Execute
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});
