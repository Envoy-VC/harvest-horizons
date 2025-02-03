import type { ItemType } from '~/types/game';

export const lootTable: Record<
  number,
  {
    item: ItemType;
    quantity: number;
  }[]
> = {
  0: [
    { item: 'carrot', quantity: 2 },
    { item: 'carrot-seeds', quantity: 1 },
    { item: 'coin', quantity: 5 },
  ],
  1: [
    { item: 'carrot', quantity: 3 },
    { item: 'carrot-seeds', quantity: 2 },
    { item: 'coin', quantity: 10 },
    { item: 'tomato-seeds', quantity: 1 },
  ],
  2: [
    { item: 'carrot', quantity: 5 },
    { item: 'tomato', quantity: 2 },
    { item: 'carrot-seeds', quantity: 3 },
    { item: 'tomato-seeds', quantity: 2 },
    { item: 'coin', quantity: 15 },
  ],
  3: [
    { item: 'carrot', quantity: 7 },
    { item: 'tomato', quantity: 4 },
    { item: 'potato-seeds', quantity: 2 },
    { item: 'carrot-seeds', quantity: 4 },
    { item: 'coin', quantity: 25 },
  ],
  4: [
    { item: 'carrot', quantity: 10 },
    { item: 'tomato', quantity: 5 },
    { item: 'potato', quantity: 2 },
    { item: 'potato-seeds', quantity: 3 },
    { item: 'coin', quantity: 40 },
  ],
  5: [
    { item: 'carrot', quantity: 12 },
    { item: 'tomato', quantity: 8 },
    { item: 'potato', quantity: 4 },
    { item: 'potato-seeds', quantity: 4 },
    { item: 'carrot-seeds', quantity: 5 },
    { item: 'coin', quantity: 60 },
  ],
  6: [
    { item: 'carrot', quantity: 15 },
    { item: 'tomato', quantity: 10 },
    { item: 'potato', quantity: 7 },
    { item: 'potato-seeds', quantity: 5 },
    { item: 'carrot-seeds', quantity: 6 },
    { item: 'tomato-seeds', quantity: 5 },
    { item: 'coin', quantity: 100 },
  ],
};
