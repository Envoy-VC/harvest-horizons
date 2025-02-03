import { createFileRoute } from '@tanstack/react-router';
import {} from '~/components';

import { ConnectButton, GameContainer, MenuButton } from '~/components';

export const HomeComponent = () => {
  return (
    <div>
      <MenuButton />
      <ConnectButton />
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
