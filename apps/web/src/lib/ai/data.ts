import { readContract } from '@wagmi/core';
import { itemsMapReverse } from 'harvest-horizon-goat-plugin';
import { harvestHorizonsConfig } from '~/data/contract';
import { db } from '~/db';
import { Position, itemCosts } from '~/game/helpers/data';
import { wagmiAdapter } from '~/providers/web3-provider';

export const GENERATE_ACTIONS_SYSTEM_PROMPT = `You are a NPC Farmer, in a game called Harvest Horizons. You help the player to perform tasks such as farming, trading, etc.

You have to break the task into atomic actions. Along with the task, you will also be given the player's inventory as well as current crops planted, and their growth stage. Also you will be given no of available farm tiles, so plan accordingly.

The available items in the game are: 'carrot', 'potato', 'tomato', 'carrot-seeds', 'potato-seeds', 'tomato-seeds', 'coin'.

The available actions and their parameters are as follows:

1. 'move' - Move to a location. Parameters: { x: number, y: number }
2. 'plant' - Plant a seed. Parameters: { seedType: 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds', amount: number }
3. 'harvest' - Harvest a crop. Parameters: { cropType: 'carrot' | 'potato' | 'tomato', amount: number }
4. 'buy' - Buy a crop, or seed from a trader shop. Parameters: { cropType: 'carrot' | 'potato' | 'tomato' | 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds', amount: number }
5. 'sell' - Sell a crop, or seed to a trader shop. Parameters: { cropType: 'carrot' | 'potato' | 'tomato' | 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds', amount: number }
6. 'updateInventory' - Update the player's inventory. Parameters: { itemType: 'carrot' | 'potato' | 'tomato' | 'carrot-seeds' | 'potato-seeds' | 'tomato-seeds' | 'coin', amount: number , operation: 'add' | 'remove' }[]

The positions in the game are as follows:

1. Trader House: { x: ${Position.TraderHouse.x}, y: ${Position.TraderHouse.y} } - Place where farmer can buy or sell goods.
2. Farmer House: { x: ${Position.FarmerHouse.x}, y: ${Position.FarmerHouse.y} } - Place where farmer lives, when not doing anything.
3. Farm: { x: ${Position.Farm.x}, y: ${Position.Farm.y} } - Place where farmer, plants and harvest crops.

The trader shop costs are as follows:

${JSON.stringify(itemCosts)}`;

export const getPlayerDetailsMessage = async (playerAddress: string) => {
  const pendingCrops = await db.crops
    .where('playerAddress')
    .equals(playerAddress)
    .and((crop) => {
      return crop.harvestAt === null;
    })
    .toArray();

  const res = await readContract(wagmiAdapter.wagmiConfig, {
    ...harvestHorizonsConfig,
    functionName: 'getPlayerInventory',
    args: [playerAddress as `0x${string}`],
  });

  const inventory = res.map((item, index) => {
    return {
      id: index,
      // biome-ignore lint/style/noNonNullAssertion: never undefined
      type: itemsMapReverse[Number(item.id)]!,
      amount: Number(item.amount),
    };
  });

  return `The player's inventory is as follows in format { item, quantity }  \n
${JSON.stringify(inventory.map((item) => ({ item: item.type, quantity: item.amount })))}

The player has ${pendingCrops.length} pending crops:
${pendingCrops.map((crop) => `- ${crop.cropType}: ${crop.tiles.length} | Growth Stage: `).join('\n')}

To plant a specific crop, the player must have the required amount of seeds in their inventory, which are used to get that crop. For example if player wants to plant 'carrot', it needs carrot seeds, so check inventory for amount of carrot seeds available.

Remember that always move first to desired location before starting an action. and after acquiring or using any item you perform a atomic action  update the player inventory using 'updateInventory' action. this is compulsory. For example if you are planting a seed, then update the inventory to remove the used amount from inventory.

If the player does not have enough seeds, they can either buy the seeds from a trader shop using coins. If not enough coins are available, then ignore that action. Always check inventory for available items before performing any action, if not available move to trader shop and purchase those items.
`;
};
