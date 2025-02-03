export const HARVEST_HORIZONS_CONTRACT_ADDRESS =
  '0xB42f3232828e044129A937Bb3dfc359Ae6c20b1B';

export type ItemType =
  | 'carrot'
  | 'potato'
  | 'tomato'
  | 'carrot-seeds'
  | 'potato-seeds'
  | 'tomato-seeds'
  | 'coin';

export const itemsMap: Record<ItemType, number> = {
  carrot: 0,
  potato: 1,
  tomato: 2,
  'carrot-seeds': 3,
  'potato-seeds': 4,
  'tomato-seeds': 5,
  coin: 6,
};

export const itemsMapReverse: Record<number, ItemType> = {
  0: 'carrot',
  1: 'potato',
  2: 'tomato',
  3: 'carrot-seeds',
  4: 'potato-seeds',
  5: 'tomato-seeds',
  6: 'coin',
};
