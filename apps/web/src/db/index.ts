import Dexie, { type EntityTable } from 'dexie';
import type { CropType, NPCActionArgs, NPCActionType } from '~/types/game';

export interface CropsPlanted {
  id: number;
  playerAddress: string;
  cropType: CropType;
  plantedAt: number;
  tiles: [number, number][];
  harvestAt: number | null;
}

interface DailyClaims {
  id: number;
  playerAddress: string;
  weekNumber: number;
  dayNumber: number;
  claimedAt: number;
}

export interface Task {
  id: number;
  playerAddress: string;
  taskType: NPCActionType;
  args: NPCActionArgs;
  message: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}

interface Chat {
  id: number;
  role: 'user' | 'assistant';
  playerAddress: string;
  message: string;
  createdAt: number;
}

export const db = new Dexie('HarvestHorizonDB') as Dexie & {
  crops: EntityTable<CropsPlanted, 'id'>;
  dailyClaims: EntityTable<DailyClaims, 'id'>;
  tasks: EntityTable<Task, 'id'>;
  chats: EntityTable<Chat, 'id'>;
};

db.version(1).stores({
  crops: '++id, playerAddress',
  dailyClaims: '++id, playerAddress, dayNumber, weekNumber',
  tasks: '++id, playerAddress',
  chats: '++id, playerAddress, role',
});
