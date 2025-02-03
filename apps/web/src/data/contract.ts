import {
  ABI,
  HARVEST_HORIZONS_CONTRACT_ADDRESS,
} from 'harvest-horizon-goat-plugin';

export const harvestHorizonsConfig = {
  address: HARVEST_HORIZONS_CONTRACT_ADDRESS,
  abi: ABI,
} as const;
