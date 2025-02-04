import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet';
import { world } from '~/game/state';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { Input } from '../ui/input';

export const ChatBox = observer(() => {
  const { address } = useAccount();
  const [open, setOpen] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const chats = useLiveQuery(() => getChats(address ?? '0x0'));

  const onChat = async (message: string) => {
    // TODO:
    // 1. Store Chat in DB
    // 2. Send to AI and generate Actions
    // 3. Store Actions in DB
    // 4. Update Chats in DB
  };

  const chats = [
    {
      id: 1,
      role: 'user',
      playerAddress: '0x0',
      message: 'Hey! Plant some carrots for me',
      createdAt: 3,
    },
    {
      id: 2,
      role: 'assistant',
      playerAddress: '0x0',
      message: 'Sure! I will plant carrots for you',
      createdAt: 3,
    },
  ];

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
            <div className='flex w-full flex-col gap-2 overflow-y-scroll '>
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
