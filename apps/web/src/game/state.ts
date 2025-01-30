import { makeAutoObservable } from 'mobx';

import type { InteractionType } from '~/types/game';

class GameState {
  isInteractionModalOpen: boolean;
  interactionType: InteractionType;

  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'farm';
    this.isInteractionModalOpen = false;
  }

  setInteractionModalOpen(isOpen: boolean, type: InteractionType) {
    this.interactionType = type;
    this.isInteractionModalOpen = isOpen;
  }
}

export const world = new GameState();
