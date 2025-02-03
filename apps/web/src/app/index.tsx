import { createFileRoute } from '@tanstack/react-router';
import { DailyRewards } from '~/components';

import { ConnectButton, GameContainer, MenuButton } from '~/components';

export const HomeComponent = () => {
  return (
    <div>
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
