import type Phaser from 'phaser';
import type { MoveToProps, UpdateProps } from '~/types/game';

export abstract class NPCAbstract {
  abstract key: string;
  abstract sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  abstract speed: number;

  abstract moveTo(props: MoveToProps): Promise<void>;
  abstract update(props: UpdateProps): void;
}
