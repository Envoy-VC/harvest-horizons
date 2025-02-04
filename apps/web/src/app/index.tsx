import { createFileRoute } from '@tanstack/react-router';
import { DailyRewards } from '~/components';

import { ConnectButton, GameContainer, MenuButton } from '~/components';
import { Button } from '~/components/ui/button';

import { useAccount } from 'wagmi';
import { generateActions } from '~/lib/ai';

export const HomeComponent = () => {
  const { address } = useAccount();
  return (
    <div>
      <div className='absolute top-24 right-12'>
        <Button
          onClick={async () => {
            if (!address) {
              return;
            }

            await generateActions(
              'I need potatoes, can you get them for me.',
              address
            );
          }}
        >
          Generate
        </Button>
      </div>
      <MenuButton />
      <ConnectButton />
      <DailyRewards />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
