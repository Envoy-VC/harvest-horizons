import mitt from 'mitt';
import type { NPCAction } from '~/types/game';
import type { CropType, GrowthStage } from './helpers/data';

export type FarmerEmitterEvents = {
  'plant-crop': { type: CropType; amount: number };
  placeCrops: {
    type: CropType;
    stage: GrowthStage;
    tiles: { x: number; y: number }[];
  }[];
  getEmptyFarmTiles: { amount: number; used: { x: number; y: number }[] };
  getEmptyFarmTilesCallback: { x: number; y: number }[];
};

export type TaskManagerEmitter = {
  'add-tasks': { task: NPCAction; id: number }[];
  'start-tasks': null;
};

export const farmerEmitter = mitt<FarmerEmitterEvents>();
export const taskEmitter = mitt<TaskManagerEmitter>();
