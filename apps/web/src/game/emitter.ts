import mitt from 'mitt';
import type { CropType } from './helpers/data';

export type FarmerEmitterEvents = {
  'plant-crop': { type: CropType; amount: number };
};

export const farmerEmitter = mitt<FarmerEmitterEvents>();
