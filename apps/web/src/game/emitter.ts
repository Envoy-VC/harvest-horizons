import mitt from 'mitt';
import type { NPCAction } from '~/types/game';
import type { CropType } from './helpers/data';

export type FarmerEmitterEvents = {
  'plant-crop': { type: CropType; amount: number };
};

export type TaskManagerEmitter = {
  'add-task': NPCAction;
};

export const farmerEmitter = mitt<FarmerEmitterEvents>();
export const taskEmitter = mitt<TaskManagerEmitter>();
