import type { GameSceneAbstract } from '~/game/classes/abstract';
import type { GrowthStage } from '~/game/helpers/data';
export type InteractionType = 'farm' | 'trader-shop';

export type CropType = 'carrot' | 'potato' | 'tomato';
export type SeedType = 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds';
export type ItemType = CropType | SeedType | 'coin';

export interface GameSceneProps {
  config: {
    playerPosition: { x: number; y: number };
    mapSize: { x: number; y: number };
  };
}

export interface UpdateProps {
  scene: GameSceneAbstract;
  time: number;
  delta: number;
}

export interface CreatePlayerProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
  scene: GameSceneAbstract;
}

export interface CreateNPCProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
  scene: GameSceneAbstract;
}

export interface MoveToProps {
  tileX: number;
  tileY: number;
  scene: GameSceneAbstract;
}

export interface TeleportProps {
  tileX: number;
  tileY: number;
  scene: GameSceneAbstract;
}

export interface PlantCropProps {
  type: CropType;
  stage: GrowthStage;
  tiles: { x: number; y: number }[];
}
