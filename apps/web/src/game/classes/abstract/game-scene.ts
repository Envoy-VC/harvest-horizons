import Phaser from 'phaser';
import type { Farm, InteractionText } from '~/game/entities';
import type { CursorKeys } from '~/game/helpers/movement';
import type { Pathfinder } from '../pathfinder';
import type { NPCAbstract } from './npc';
import type { PlayerAbstract } from './player';

export abstract class GameSceneAbstract extends Phaser.Scene {
  abstract map: Phaser.Tilemaps.Tilemap;
  abstract collisionLayer: Phaser.Tilemaps.TilemapLayer;
  abstract interactionLayer: Phaser.Tilemaps.TilemapLayer;
  abstract player: PlayerAbstract;
  abstract npcs: NPCAbstract[];
  abstract cursors: CursorKeys;
  abstract pathfinder: Pathfinder;
  abstract interactionText: InteractionText;
  abstract isModalOpen: boolean;
  abstract tileSize: number;
  abstract farm: Farm;
}
