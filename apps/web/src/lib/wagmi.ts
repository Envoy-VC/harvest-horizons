import { waitForTransactionReceipt, writeContract } from '@wagmi/core';
import { itemsMap } from 'harvest-horizon-goat-plugin';
import { harvestHorizonsConfig } from '~/data/contract';
import { wagmiAdapter } from '~/providers/web3-provider';
import type { ItemType } from '~/types/game';

export const updateInventory = async (
  address: `0x${string}`,
  items: {
    type: ItemType;
    amount: number;
    operation: 'add' | 'remove';
  }[]
) => {
  const ids = items.map((item) => BigInt(itemsMap[item.type]));
  const amounts = items.map((item) => BigInt(item.amount));
  const operations = items.map((item) => (item.operation === 'add' ? 0 : 1));
  const hash = await writeContract(wagmiAdapter.wagmiConfig, {
    ...harvestHorizonsConfig,
    functionName: 'bulkEditInventory',
    args: [address, ids, amounts, operations],
  });
  await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });
};

import { http, createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { avalancheFuji } from 'viem/chains';

const account = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY);

export const walletClient = createWalletClient({
  account,
  chain: avalancheFuji,
  transport: http(),
});
