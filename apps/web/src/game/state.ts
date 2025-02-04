import { makeAutoObservable } from 'mobx';

import type { InteractionType } from '~/types/game';

class GameState {
  isInteractionModalOpen: boolean;
  interactionType: InteractionType;
  keyboardInteractionsDisabled: boolean;
  currentScene: 'GameScene' | 'MenuScreen';
  availableFarmTiles: { x: number; y: number }[];

  constructor() {
    makeAutoObservable(this);
    this.interactionType = 'farm';
    this.isInteractionModalOpen = false;
    this.keyboardInteractionsDisabled = false;
    this.currentScene = 'MenuScreen';
    this.availableFarmTiles = [];
  }

  setInteractionModalOpen(isOpen: boolean, type: InteractionType) {
    this.interactionType = type;
    this.isInteractionModalOpen = isOpen;
  }

  changeScene(scene: 'GameScene' | 'MenuScreen') {
    this.currentScene = scene;
  }

  disableKeyboardInteractions() {
    this.keyboardInteractionsDisabled = true;
  }

  enableKeyboardInteractions() {
    this.keyboardInteractionsDisabled = false;
  }

  setAvailableFarmTiles(tiles: { x: number; y: number }[]) {
    this.availableFarmTiles = tiles;
  }
}

export const world = new GameState();
