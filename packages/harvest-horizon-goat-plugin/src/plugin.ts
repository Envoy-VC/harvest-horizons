import { type Chain, PluginBase } from '@goat-sdk/core';
import type { EVMWalletClient } from '@goat-sdk/wallet-evm';

import { getTools } from './tools';

export class HarvestHorizonsPlugin extends PluginBase<EVMWalletClient> {
  constructor() {
    super('Harvest Horizons', []);
  }
  supportsChain = (chain: Chain) => chain.type === 'evm' && chain.id === 43113;
  getTools(walletClient: EVMWalletClient) {
    const network = walletClient.getChain();

    if (!network.id) {
      throw new Error('Network ID is required');
    }

    return getTools(walletClient);
  }
}

export function harvestHorizons() {
  return new HarvestHorizonsPlugin();
}
