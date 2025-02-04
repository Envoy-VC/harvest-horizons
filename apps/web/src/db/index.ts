import Dexie, { type EntityTable } from 'dexie';
import type { CropType, NPCActionArgs, NPCActionType } from '~/types/game';

interface CropsPlanted {
  id: number;
  address: string;
  cropType: CropType;
  plantedAt: number;
  tiles: { x: number; y: number }[];
  harvestAt: string | null;
}

interface DailyClaims {
  id: number;
  playerAddress: string;
  weekNumber: number;
  dayNumber: number;
  claimedAt: number;
}

interface Task {
  id: number;
  playerAddress: string;
  taskType: NPCActionType;
  args: NPCActionArgs;
  completed: boolean;
  createdAt: number;
}

export const db = new Dexie('HarvestHorizonDB') as Dexie & {
  crops: EntityTable<CropsPlanted, 'id'>;
  dailyClaims: EntityTable<DailyClaims, 'id'>;
  tasks: EntityTable<Task, 'id'>;
};

db.version(1).stores({
  crops: '++id, address, playerAddress',
  dailyClaims: '++id, playerAddress, dayNumber, weekNumber',
  tasks: '++id, playerAddress',
});
