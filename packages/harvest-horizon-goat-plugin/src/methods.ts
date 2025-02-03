import type { EVMWalletClient } from '@goat-sdk/wallet-evm';
import { ABI } from './abi';
import { HARVEST_HORIZONS_CONTRACT_ADDRESS } from './constants';
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

const itemsMap: Record<string, number> = {
  Carrot: 0,
  Potato: 1,
  Tomato: 2,
  'Carrot Seeds': 3,
  'Potato Seeds': 4,
  'Tomato Seeds': 5,
  Coin: 6,
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
    return itemsMap[itemId] ?? 7;
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
