import type { InteractionType } from '~/types/game';
import { FarmInteraction } from './farm';

import { observer } from 'mobx-react-lite';
import { Dialog, DialogContent } from '~/components/ui/dialog';
import { world } from '~/game/state';

export const InteractionContent = ({
  interactionType,
}: {
  interactionType: InteractionType;
}) => {
  if (interactionType === 'farm') {
    return <FarmInteraction />;
  }
  return (
    <div className='flex h-full w-full items-center justify-center text-center font-minecraftia text-5xl'>
      Coming Soon
    </div>
  );
};

export const InteractionDialog = observer(() => {
  return (
    <Dialog
      open={world.isInteractionModalOpen}
      onOpenChange={(open) => world.setInteractionModalOpen(open, 'farm')}
    >
      <DialogContent className='w-full max-w-3xl'>
        <InteractionContent interactionType={world.interactionType} />
      </DialogContent>
    </Dialog>
  );
});
