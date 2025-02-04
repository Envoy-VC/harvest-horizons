export const FarmTile = 858;
export const CropTiles = {
  Carrot: {
    Sprout: [880, 866],
    Seedling: [882, 868],
    Growth: [884, 870],
    Harvest: [886, 872],
  },
  Tomato: {
    Sprout: [908, 894],
    Seedling: [910, 896],
    Growth: [912, 898],
    Harvest: [914, 900],
  },
  Potato: {
    Sprout: [936, 922],
    Seedling: [938, 924],
    Growth: [940, 926],
    Harvest: [942, 928],
  },
} as const;

export type CropType = keyof typeof CropTiles;
export type GrowthStage = 'Sprout' | 'Seedling' | 'Growth' | 'Harvest';

export const Position = {
  TraderHouse: { x: 5, y: 6 },
  FarmerHouse: { x: 26, y: 7 },
  Farm: { x: 24, y: 13 },
};

export const itemCosts = [
  { type: 'carrot', quantity: 3, coinsNeeded: 1 },
  { type: 'tomato', quantity: 2, coinsNeeded: 1 },
  { type: 'potato', quantity: 4, coinsNeeded: 1 },
  { type: 'carrot-seeds', quantity: 8, coinsNeeded: 1 },
  { type: 'tomato-seeds', quantity: 6, coinsNeeded: 1 },
  { type: 'potato-seeds', quantity: 10, coinsNeeded: 1 },
];
