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
  args: z.object({
    x: z.number().describe('The x coordinate of the tile to move to'),
    y: z.number().describe('The y coordinate of the tile to move to'),
  }),
});

const farmSchema = z.object({
  action: z.literal('plant'),
  args: z.object({
    seedType: z
      .union([
        z.literal('carrot-seeds'),
        z.literal('potato-seeds'),
        z.literal('tomato-seeds'),
      ])
      .describe('The seed type to plant'),
    amount: z.number().describe('The amount of seeds to plant'),
  }),
});

const harvestSchema = z.object({
  action: z.literal('harvest'),
  args: z.object({
    cropType: z
      .union([z.literal('carrot'), z.literal('potato'), z.literal('tomato')])
      .describe('The crop type to harvest'),
    amount: z.number().describe('The amount of crops to harvest'),
  }),
});

const buySchema = z.object({
  action: z.literal('buy'),
  args: z.object({
    cropType: z
      .union([
        z.literal('carrot'),
        z.literal('potato'),
        z.literal('tomato'),
        z.literal('carrot-seeds'),
        z.literal('potato-seeds'),
        z.literal('potato-seeds'),
      ])
      .describe('The crop type to buy from trader shop'),
    amount: z.number().describe('The amount of crops to buy'),
  }),
});

const sellSchema = z.object({
  action: z.literal('sell'),
  args: z.object({
    cropType: z
      .union([
        z.literal('carrot'),
        z.literal('potato'),
        z.literal('tomato'),
        z.literal('carrot-seeds'),
        z.literal('potato-seeds'),
        z.literal('potato-seeds'),
      ])
      .describe('The crop type to sell to trader shop'),
    amount: z.number().describe('The amount of crops to sell'),
  }),
});

const updateInventorySchema = z.object({
  action: z.literal('updateInventory'),
  args: z.array(
    z.object({
      itemType: z
        .union([
          z.literal('carrot'),
          z.literal('potato'),
          z.literal('tomato'),
          z.literal('carrot-seeds'),
          z.literal('potato-seeds'),
          z.literal('potato-seeds'),
          z.literal('coin'),
        ])
        .describe('The item type to update'),
      amount: z.number().describe('The amount of that item to update'),
      operation: z
        .union([z.literal('add'), z.literal('remove')])
        .describe('The operation to perform'),
    })
  ),
});

export const npcActionSchema = z.union([
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
export type NPCFarmArgs = z.infer<typeof farmSchema>['args'];
export type NPCHarvestArgs = z.infer<typeof harvestSchema>['args'];
export type NPCBuyArgs = z.infer<typeof buySchema>['args'];
export type NPCSellArgs = z.infer<typeof sellSchema>['args'];
export type NPCAction = z.infer<typeof npcActionSchema>;
