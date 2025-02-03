import type { EVMWalletClient } from '@goat-sdk/wallet-evm';
import { ABI } from './abi';
import {
  HARVEST_HORIZONS_CONTRACT_ADDRESS,
  type ItemType,
  itemsMap,
} from './constants';
import type {
  BulkEditInventoryParameters,
  GetInventoryParameters,
} from './parameters';
import type { Inventory } from './types';

export const getInventory = async (
  walletClient: EVMWalletClient,
  parameters: GetInventoryParameters
) => {
  try {
    const res = await walletClient.read({
      address: HARVEST_HORIZONS_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'getPlayerInventory',
      args: [parameters.playerAddress],
    });

    return res.value as Inventory;
  } catch (error) {
    throw new Error(`Error getting game: ${String(error)}`);
  }
};

export const bulkEditInventory = async (
  walletClient: EVMWalletClient,
  parameters: BulkEditInventoryParameters
): Promise<string> => {
  const operations = parameters.operations.map((operation) => {
    if (operation === 'Add') {
      return 0;
    }
    return 1;
  });
  const items = parameters.itemIds.map((itemId) => {
    return itemsMap[itemId as ItemType] ?? 7;
  });
  try {
    const res = await walletClient.sendTransaction({
      to: HARVEST_HORIZONS_CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'bulkEditInventory',
      args: [parameters.playerAddress, items, parameters.amounts, operations],
    });
    return res.hash;
  } catch (error) {
    throw new Error(`Error voting: ${String(error)}`);
  }
};
