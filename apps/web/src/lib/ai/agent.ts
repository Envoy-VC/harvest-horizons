import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { viem } from '@goat-sdk/wallet-viem';
import { generateText } from 'ai';
import { harvestHorizons } from 'harvest-horizon-goat-plugin';
import { getModel } from '.';
import { walletClient } from '../wagmi';

const getTools = async () => {
  return await getOnChainTools({
    wallet: viem(walletClient),
    plugins: [harvestHorizons()],
  });
};

export const callAgent = async (message: string) => {
  const model = getModel();
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
