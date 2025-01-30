import { createFileRoute } from '@tanstack/react-router';
import {} from '~/components';

import { GameContainer } from '~/components';

export const HomeComponent = () => {
  return (
    <div>
      <GameContainer />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: HomeComponent,
});
