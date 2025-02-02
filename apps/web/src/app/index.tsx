import { createFileRoute } from '@tanstack/react-router';
import {} from '~/components';

import { GameContainer } from '~/components';
import { IconButton } from '~/components/ui/icon-button';

export const HomeComponent = () => {
  return (
    <div>
      <div className='absolute top-4 left-4'>
        <IconButton icon='menu-button' innerClassName='h-8 w-8' />
      </div>
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
