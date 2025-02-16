import { z } from 'zod';
import type { GameSceneAbstract } from '~/game/classes/abstract';
import type { GrowthStage } from '~/game/helpers/data';
export type InteractionType = 'farm' | 'trader-shop';

export type CropType = 'carrot' | 'potato' | 'tomato';
export type SeedType = 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds';
export type ItemType = CropType | SeedType | 'coin';

export interface GameSceneProps {
  config: {
    playerPosition: { x: number; y: number };
    mapSize: { x: number; y: number };
  };
}

export interface UpdateProps {
  scene: GameSceneAbstract;
  time: number;
  delta: number;
}

export interface CreatePlayerProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
  scene: GameSceneAbstract;
}

export interface CreateNPCProps {
  x: number;
  y: number;
  speed: number;
  sprite: string;
  scene: GameSceneAbstract;
}

export interface MoveToProps {
  tileX: number;
  tileY: number;
  scene: GameSceneAbstract;
}

export interface TeleportProps {
  tileX: number;
  tileY: number;
  scene: GameSceneAbstract;
}

export interface PlantCropProps {
  type: CropType;
  stage: GrowthStage;
  tiles: { x: number; y: number }[];
}

const moveSchema = z.object({
  action: z.literal('move'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.object({
    x: z.number().describe('The x coordinate of the tile to move to'),
    y: z.number().describe('The y coordinate of the tile to move to'),
  }),
});

const farmSchema = z.object({
  action: z.literal('plant'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.object({
    seedType: z
      .enum(['carrot-seeds', 'potato-seeds', 'tomato-seeds'])
      .describe('The seed type to plant'),
    amount: z.number().describe('The amount of seeds to plant'),
  }),
});

const harvestSchema = z.object({
  action: z.literal('harvest'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.object({
    cropType: z
      .union([z.literal('carrot'), z.literal('potato'), z.literal('tomato')])
      .describe('The crop type to harvest'),
    amount: z.number().describe('The amount of crops to harvest'),
  }),
});

const buySchema = z.object({
  action: z.literal('buy'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.object({
    cropType: z
      .enum([
        'carrot',
        'potato',
        'tomato',
        'carrot-seeds',
        'potato-seeds',
        'tomato-seeds',
      ])
      .describe('The crop type to buy from trader shop'),
    amount: z.number().describe('The amount of crops to buy'),
  }),
});

const sellSchema = z.object({
  action: z.literal('sell'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.object({
    cropType: z
      .enum([
        'carrot',
        'potato',
        'tomato',
        'carrot-seeds',
        'potato-seeds',
        'tomato-seeds',
      ])
      .describe('The crop type to sell to trader shop'),
    amount: z.number().describe('The amount of crops to sell'),
  }),
});

const updateInventorySchema = z.object({
  action: z.literal('updateInventory'),
  message: z
    .string()
    .describe(
      'A small message to display to the player, related to the action why it was taken'
    ),
  args: z.array(
    z.object({
      itemType: z
        .enum([
          'carrot',
          'potato',
          'tomato',
          'carrot-seeds',
          'potato-seeds',
          'tomato-seeds',
          'coin',
        ])
        .describe('The item type to update'),
      amount: z.number().describe('The amount of that item to update'),
      operation: z
        .union([z.literal('add'), z.literal('remove')])
        .describe('The operation to perform'),
    })
  ),
});

export const npcActionSchema = z.discriminatedUnion('action', [
  moveSchema,
  farmSchema,
  harvestSchema,
  buySchema,
  sellSchema,
  updateInventorySchema,
]);

export type NPCActionType = z.infer<typeof npcActionSchema>['action'];
export type NPCActionArgs = z.infer<typeof npcActionSchema>['args'];
export type NPCMoveArgs = z.infer<typeof moveSchema>['args'];
export type NPCPlantArgs = z.infer<typeof farmSchema>['args'];
export type NPCHarvestArgs = z.infer<typeof harvestSchema>['args'];
export type NPCBuyArgs = z.infer<typeof buySchema>['args'];
export type NPCSellArgs = z.infer<typeof sellSchema>['args'];
export type NPCUpdateInventoryArgs = z.infer<
  typeof updateInventorySchema
>['args'];

export type NPCAction = z.infer<typeof npcActionSchema>;

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export interface Crop {
  name: CropType;
  seedName: string;
  season: Season;
  quality: 'low' | 'medium' | 'high'; // Higher quality = higher profit
  yieldVariance: {
    min: number; // Minimum yield per seed
    max: number; // Maximum yield per seed
  };
  seasonalBoost: {
    idealWeather: Season[]; // Boosts growth if the weather matches
    growthSpeedMultiplier: number; // Example: 1.2x speed in rainy weather
  };
  // Growth Stage as per time elapsed [start, end]
  growthStages: {
    Sprout: [number, number];
    Seedling: [number, number];
    Growth: [number, number];
    Harvest: [number, number];
  };
  // Watering requirement between growing and readyToHarvest
  wateringRequirement: {
    frequency: number;
  };
  rotationBenefit: {
    after: CropType; // If this crop is planted before this crop
    percentageMultiplier: number; // Example: 1.2x yield if planted after wheat
  }[];
}
