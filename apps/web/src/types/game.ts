import type { GameSceneAbstract } from '~/game/classes/abstract';
export type InteractionType = 'farm' | 'trader-shop';

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
  nearTo: { x: number; y: number; radius: number };
  speed: number;
  sprite: string;
  scene: GameSceneAbstract;
}

export interface TeleportProps {
  tileX: number;
  tileY: number;
  scene: GameSceneAbstract;
}
