import type Phaser from 'phaser';
import type { CreatePlayerProps, UpdateProps } from '~/types/game';
import type { PlayerAbstract } from '../classes/abstract';
import { registerMovement } from '../helpers/movement';

export class Player implements PlayerAbstract {
  key: string;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  speed: number;

  constructor({ x, y, sprite, speed, scene }: CreatePlayerProps) {
    this.key = sprite;
    this.sprite = scene.physics.add
      .sprite(x, y, sprite)
      .setScale(1)
      .setDepth(9)
      .setBodySize(32, 42)
      .setOffset(16, 24);

    this.sprite.setCollideWorldBounds(true);
    this.speed = speed;

    // on map click, log world coordinates in tiles
    // scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    //   console.log({
    //     worldX: pointer.worldX,
    //     worldY: pointer.worldY,
    //     x: pointer.x,
    //     y: pointer.y,
    //   });

    //   const tileX = Math.floor(pointer.worldX / 16);
    //   const tileY = Math.floor(pointer.worldY / 16);
    //   console.log(`Tile X: ${tileX}, Tile Y: ${tileY}`);
    //   const targetX = scene.map.tileToWorldX(tileX, scene.cameras.main);
    //   const targetY = scene.map.tileToWorldY(tileY, scene.cameras.main);

    //   console.log(`Target X: ${targetX}, Target Y: ${targetY}`);
    // });
  }

  update({ scene }: UpdateProps) {
    registerMovement(this.key, scene.cursors, this.speed, this.sprite, scene);
  }
}
