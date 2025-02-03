import Dexie, { type EntityTable } from 'dexie';
import type { CropType } from '~/types/game';

interface CropsPlanted {
  id: number;
  address: string;
  cropType: CropType;
  plantedAt: number;
  tiles: { x: number; y: number }[];
  harvestAt: string;
}

interface DailyClaims {
  id: number;
  playerAddress: string;
  weekNumber: number;
  dayNumber: number;
  claimedAt: number;
}

export const db = new Dexie('HarvestHorizonDB') as Dexie & {
  crops: EntityTable<CropsPlanted, 'id'>;
  dailyClaims: EntityTable<DailyClaims, 'id'>;
};

db.version(1).stores({
  crops: '++id, address',
  dailyClaims: '++id, playerAddress, dayNumber',
});
