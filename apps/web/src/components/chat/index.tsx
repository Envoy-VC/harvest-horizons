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
import { db } from '~/db';
import { getChats } from '~/db/actions';
import { world } from '~/game/state';
import { generateActions } from '~/lib/ai';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Input } from '../ui/input';

export const ChatBox = observer(() => {
  const { address } = useAccount();
  const [open, setOpen] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const chats = useLiveQuery(() => getChats(address ?? '0x0'));

  const onChat = async (message: string) => {
    if (message.trim() === '') {
      return;
    }
    try {
      setIsLoading(true);
      if (!address) {
        throw new Error('Please connect wallet');
      }
      // TODO:
      // 1. Store Chat in DB
      await db.chats.add({
        role: 'user',
        message,
        createdAt: Date.now(),
        playerAddress: address,
      });
      // 2. Send to AI and generate Actions
      const res = await generateActions(message, address);
      if (!res) {
        throw new Error('Unable to generate.');
      }
      // 3. Store Actions in DB
      await db.tasks.bulkAdd(
        res.actions.map((action, index) => ({
          taskType: action.action,
          args: action.args,
          message: action.message,
          playerAddress: address,
          status: 'pending',
          createdAt: Date.now() + index,
        }))
      );
      // 4. Update Chats in DB
      await db.chats.add({
        role: 'assistant',
        message: res.response,
        createdAt: Date.now(),
        playerAddress: address,
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className='absolute right-4 bottom-4'>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger>
          <Button>Chat</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Chat</SheetTitle>
          </SheetHeader>
          <div className='flex h-full w-full flex-col justify-between py-4'>
            <div className='hide-scrollbar flex w-full flex-col gap-2 overflow-y-scroll'>
              {(chats ?? [])?.map((chat) => {
                if (chat.role === 'user') {
                  return (
                    <div
                      key={chat.id}
                      className='w-fit max-w-[16rem] text-wrap rounded-xl border-2 border-[#A85F46] px-4 pt-2 text-sm'
                    >
                      {chat.message}
                    </div>
                  );
                }
                return (
                  <div className='flex w-full justify-end' key={chat.id}>
                    <div className='w-fit max-w-[16rem] rounded-xl border-2 border-[#D0BE9C] bg-[#A85F46] px-4 pt-2 text-[#D0BE9C] text-sm'>
                      {chat.message}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='flex flex-row items-center gap-3'>
              <Input
                placeholder='Chat with AI Farmers'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className=''
              />
              <IconButton
                disabled={isLoading}
                icon={isLoading ? 'pending-button' : 'check-button'}
                className='h-10 min-h-10 w-10 min-w-10'
                onClick={() => onChat(message)}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
});
