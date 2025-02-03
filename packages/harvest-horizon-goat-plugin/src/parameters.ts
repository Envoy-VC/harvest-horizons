import { z } from 'zod';

export const getInventorySchema = z.object({
  playerAddress: z
    .string()
    .describe('The address of the player to get the inventory for'),
});

export const bulkEditInventorySchema = z.object({
  playerAddress: z
    .string()
    .describe('The address of the player to edit the inventory for'),
  itemIds: z
    .array(z.string())
    .describe(
      `The Item to Edit, one of ['carrot', 'potato', 'tomato', 'carrot-seeds', 'potato-seeds', 'tomato-seeds', 'coin']`
    ),
  amounts: z.array(z.number()).describe('The amounts of the items to edit'),
  operations: z
    .array(z.enum(['Add', 'Remove']))
    .describe('The operations to perform on the items'),
});

export type GetInventoryParameters = z.infer<typeof getInventorySchema>;
export type BulkEditInventoryParameters = z.infer<
  typeof bulkEditInventorySchema
>;
