import { createFileRoute } from '@tanstack/react-router';
import {
  ChatBox,
  ConnectButton,
  DailyRewards,
  GameContainer,
  MenuButton,
  TasksButton,
} from '~/components';

import { observer } from 'mobx-react-lite';

import { InteractionDialog } from '~/components/interactions';
import { world } from '~/game/state';

export const HomeComponent = () => {
  return (
    <div>
      <GameElements />
      <GameContainer />
      <ConnectButton />
      <InteractionDialog />
    </div>
  );
};

const GameElements = observer(() => {
  if (world.currentScene === 'GameScene') {
    return (
      <div>
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
