import Dexie, { type EntityTable } from 'dexie';

// biome-ignore lint/nursery/noEnum: <explanation>
export enum CropType {
  Carrot = 0,
  Potato = 1,
  Tomato = 2,
}

interface CropsPlanted {
  id: number;
  address: string;
  cropType: CropType;
  plantedAt: number;
  tiles: { x: number; y: number }[];
  harvestAt: string;
}

export const db = new Dexie('FriendsDatabase') as Dexie & {
  crops: EntityTable<CropsPlanted, 'id'>;
};

db.version(1).stores({
  crops: '++id, address',
});
