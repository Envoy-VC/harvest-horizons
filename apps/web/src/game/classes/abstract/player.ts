import type Phaser from 'phaser';
import type { UpdateProps } from '~/types/game';

export abstract class PlayerAbstract {
  abstract sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  abstract speed: number;

  abstract update(props: UpdateProps): void;
}
