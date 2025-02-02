import { createFileRoute } from '@tanstack/react-router';
import {} from '~/components';

import { GameContainer } from '~/components';
import { MenuButton } from '~/components/menu';

export const HomeComponent = () => {
  return (
    <div>
      <MenuButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
