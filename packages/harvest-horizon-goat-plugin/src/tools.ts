import { type ToolBase, createTool } from '@goat-sdk/core';
import type { EVMWalletClient } from '@goat-sdk/wallet-evm';

import { bulkEditInventory, getInventory } from './methods';
import {
  type BulkEditInventoryParameters,
  type GetInventoryParameters,
  bulkEditInventorySchema,
  getInventorySchema,
} from './parameters';

export function getTools(walletClient: EVMWalletClient): ToolBase[] {
  const tools: ToolBase[] = [];

  const getInventoryTool = createTool(
    {
      name: 'get-player-inventory',
      // biome-ignore lint/style/noUnusedTemplateLiteral: needed
      description: `This {{tool}} gets the inventory of the specified player address`,
      parameters: getInventorySchema,
    },
    (parameters: GetInventoryParameters) =>
      getInventory(walletClient, parameters)
  );

  const bulkEditInventoryTool = createTool(
    {
      name: 'bulk-edit-inventory',
      // biome-ignore lint/style/noUnusedTemplateLiteral: needed
      description: `This {{tool}} edits the inventory of the specified player address`,
      parameters: bulkEditInventorySchema,
    },
    (parameters: BulkEditInventoryParameters) =>
      bulkEditInventory(walletClient, parameters)
  );

  tools.push(getInventoryTool, bulkEditInventoryTool);

  return tools;
}
