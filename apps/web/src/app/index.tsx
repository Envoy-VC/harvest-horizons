import { createFileRoute } from '@tanstack/react-router';
import { DailyRewards } from '~/components';

import { ConnectButton, GameContainer, MenuButton } from '~/components';
import { Button } from '~/components/ui/button';
import { taskEmitter } from '~/game/emitter';

export const HomeComponent = () => {
  return (
    <div>
      <div className='absolute top-24 right-12'>
        <Button
          onClick={() => {
            taskEmitter.emit('add-task', {
              action: 'move',
              args: { x: 6, y: 9 },
            });
          }}
        >
          Task
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
