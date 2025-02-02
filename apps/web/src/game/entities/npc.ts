import type Phaser from 'phaser';
import { sleep } from '~/lib/utils';
import type { CreateNPCProps, MoveToProps, UpdateProps } from '~/types/game';
import { type GameSceneAbstract, NPCAbstract } from '../classes/abstract';
export class NPC extends NPCAbstract {
  key: string;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  speed: number;
  targetPath: [number, number][];
  isMoving: boolean;

  constructor({ x, y, sprite, speed, scene }: CreateNPCProps) {
    super();
    this.key = sprite;
    this.sprite = scene.physics.add
      .sprite(x, y, sprite)
      .setScale(1)
      .setDepth(9)
      .setBodySize(32, 42)
      .setOffset(16, 24);
    this.isMoving = false;
    this.sprite.setCollideWorldBounds(true);
    this.speed = speed;
    this.targetPath = [];
    scene.input.on('pointerdown', async (pointer: Phaser.Input.Pointer) => {
      if (this.isMoving) {
        return;
      }
      const zoom = scene.cameras.main.zoom;
      const tileX = Math.floor(pointer.worldX / (scene.tileSize * zoom));
      const tileY = Math.floor(pointer.worldY / (scene.tileSize * zoom));
      await this.moveTo({ tileX, tileY, scene });
      console.log('Reached Destination');
    });
  }

  async moveTo({ tileX, tileY, scene }: MoveToProps) {
    this.isMoving = true;
    const { x, y } = this.getTilePosition(scene);
    const path = scene.pathfinder.findPath(x, y, tileX, tileY);
    if (path.length === 0) {
      this.isMoving = false;
      return;
    }
    this.targetPath = path as [number, number][];
    const waitForComplete = async () => {
      if (this.targetPath.length === 0) {
        return await Promise.resolve(true);
      }
      await sleep(100);
      return await waitForComplete();
    };

    await waitForComplete();
    this.isMoving = false;
  }

  private playWalkingAnimation(velocityX: number, velocityY: number) {
    let direction: string;
    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      if (velocityX > 0) {
        direction = 'east';
      } else {
        direction = 'west';
      }
    } else if (velocityY > 0) {
      direction = 'south';
    } else {
      direction = 'north';
    }
    this.sprite.anims.play(`${this.key}-walk-${direction}`, true);
  }

  getTilePosition(scene: GameSceneAbstract) {
    const zoom = scene.cameras.main.zoom;
    const spriteX = Math.floor(this.sprite.x / (scene.tileSize * zoom));
    const spriteY = Math.floor(this.sprite.y / (scene.tileSize * zoom));
    return { x: spriteX, y: spriteY };
  }

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: <explanation>
  update(props: UpdateProps) {
    if (this.targetPath.length > 0) {
      const target = this.targetPath[0];
      if (!target) {
        return;
      }

      const { x, y } = this.getTilePosition(props.scene);
      if (x === target[0] && y === target[1]) {
        this.targetPath.shift();
      } else {
        let velocityX = 0;
        let velocityY = 0;
        if (x !== target[0]) {
          velocityX = target[0] > x ? this.speed : -this.speed;
        } else if (y !== target[1]) {
          velocityY = target[1] > y ? this.speed : -this.speed;
        }

        this.sprite.setVelocity(velocityX, velocityY);
        this.playWalkingAnimation(velocityX, velocityY);
      }
    } else {
      this.sprite.setVelocity(0, 0);
      const currentAnimation =
        this.sprite.anims.currentAnim?.key ?? `${this.key}-walk-north`;
      const idelAnimation = currentAnimation.replace('walk', 'idle');
      this.sprite.anims.play(idelAnimation);
    }
  }
}
