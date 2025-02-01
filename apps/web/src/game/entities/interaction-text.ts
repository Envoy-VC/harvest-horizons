import type Phaser from 'phaser';

import { world } from '../state';

import type {
  CreatePlayerProps,
  InteractionType,
  UpdateProps,
} from '~/types/game';

export class InteractionText {
  isTransitioning: boolean;
  private interactionText: Phaser.GameObjects.Text;
  private interactionType: InteractionType | null;

  constructor(scene: CreatePlayerProps['scene']) {
    this.interactionType = null;
    this.isTransitioning = false;
    this.interactionText = scene.add.text(0, 0, 'Press E to interact', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });

    scene.input.keyboard?.on('keydown-E', () => {
      if (!this.interactionType) {
        return;
      }

      world.setInteractionModalOpen(true, this.interactionType);
      this.isTransitioning = false;
    });
  }

  checkInteractionTile(scene: CreatePlayerProps['scene']) {
    const playerX = scene.player.sprite.x;
    const playerY = scene.player.sprite.y;

    const tile = scene.interactionLayer.getTileAtWorldXY(
      playerX,
      playerY,
      true
    );

    if (tile.properties !== null && 'interactionType' in tile.properties) {
      return tile;
    }
    return null;
  }

  handleInteraction(
    scene: CreatePlayerProps['scene'],
    tile: Phaser.Tilemaps.Tile
  ) {
    const interactionType = (
      tile.properties as {
        interactionType: InteractionType;
      }
    ).interactionType;
    this.interactionType = interactionType;
    this.interactionText
      .setText('Press E to interact')
      .setPosition(scene.cameras.main.width / 2, 750)
      .setOrigin(0.5, 0.5)
      .setAlpha(1)
      .setDepth(50)
      .setScrollFactor(0)
      .setVisible(true)
      .setBackgroundColor('#C3AC90')
      .setColor('#6B5052')
      .setPadding(6, 2, 6, 2)
      .setFontFamily('Minecraftia');
    if (this.isTransitioning) {
      return;
    }
    this.isTransitioning = true;
  }

  cleanupAndTransition(
    scene: CreatePlayerProps['scene'],
    targetScene: string,
    data: { playerPosition: { x: number; y: number } }
  ) {
    scene.input.keyboard?.off('keydown-E', this.handleInteraction);
    scene.scene.switch(targetScene, data);
  }

  update({ scene }: UpdateProps) {
    const tile = this.checkInteractionTile(scene);
    if (tile) {
      this.handleInteraction(scene, tile);
    } else {
      this.interactionType = null;
      this.interactionText.setAlpha(0);
    }
  }
}
