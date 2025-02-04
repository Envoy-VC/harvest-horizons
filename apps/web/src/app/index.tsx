import { createFileRoute } from '@tanstack/react-router';
import {
  ChatBox,
  ConnectButton,
  DailyRewards,
  GameContainer,
  MenuButton,
  TasksButton,
} from '~/components';

import { Button } from '~/components/ui/button';

import { observer } from 'mobx-react-lite';
import { useAccount } from 'wagmi';

import { world } from '~/game/state';
import { generateActions } from '~/lib/ai';

export const HomeComponent = () => {
  return (
    <div>
      <GameElements />
      <GameContainer />
      <ConnectButton />
    </div>
  );
};

const GameElements = observer(() => {
  const { address } = useAccount();
  if (world.currentScene === 'GameScene') {
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
        <DailyRewards />
        <ChatBox />
        <TasksButton />
      </div>
    );
  }

  return null;
});

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
