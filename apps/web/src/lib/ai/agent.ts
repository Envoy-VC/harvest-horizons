import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { viem } from '@goat-sdk/wallet-viem';
import { generateText } from 'ai';
import { harvestHorizons } from 'harvest-horizon-goat-plugin';
import { walletClient } from '../wagmi';
import { model } from './index';

const getTools = async () => {
  return await getOnChainTools({
    wallet: viem(walletClient),
    plugins: [harvestHorizons()],
  });
};

export const callAgent = async (message: string) => {
  const tools = await getTools();
  const result = await generateText({
    model,
    tools: tools,
    maxSteps: 1,
    prompt: message,
  });

  console.log(result);

  return result;
};

// export const updateInventoryAgent = async (
//   address: `0x${string}`,
//   items: {
//     type: ItemType;
//     amount: number;
//     operation: 'add' | 'remove';
//   }[]
// ) => {
//   const ids = items.map((item) => BigInt(itemsMap[item.type]));
//   const amounts = items.map((item) => BigInt(item.amount));
//   const operations = items.map((item) => (item.operation === 'add' ? 0 : 1));
//   const hash = await walletClient.writeContract({
//     ...harvestHorizonsConfig,
//     functionName: 'bulkEditInventory',
//     args: [address, ids, amounts, operations],
//   });
//   await waitForTransactionReceipt(walletClient, { hash });
// };
