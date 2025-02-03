import { createFileRoute } from '@tanstack/react-router';
import {} from '~/components';

import { GameContainer } from '~/components';
import { MenuButton } from '~/components/menu';
import { Button } from '~/components/ui/button';
import { farmerEmitter } from '~/game/emitter';

export const HomeComponent = () => {
  return (
    <div>
      <MenuButton />
      <div className='absolute top-4 left-4'>
        <Button
          onClick={() => {
            console.log('Event Emitted');
            farmerEmitter.emit('plant-crop', { type: 'Carrot', amount: 5 });
          }}
        >
          Plant
        </Button>
      </div>
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
