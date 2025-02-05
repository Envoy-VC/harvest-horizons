import { getAccount } from '@wagmi/core';
import { db } from '~/db';
import * as Actions from '~/db/actions';
import { callAgent } from '~/lib/ai/agent';
import { sleep } from '~/lib/utils';
import { wagmiAdapter } from '~/providers/web3-provider';
import type {
  CropType,
  NPCAction,
  NPCHarvestArgs,
  NPCMoveArgs,
  NPCPlantArgs,
  NPCUpdateInventoryArgs,
} from '~/types/game';
import type { NPCAbstract } from '../classes/abstract';
import type { GameSceneAbstract } from '../classes/abstract/game-scene';
import { taskEmitter } from '../emitter';

export class TaskScheduler {
  queue: (() => Promise<void>)[];
  constructor() {
    this.queue = [];
  }

  async addTasks({
    scene,
    tasks,
  }: {
    scene: GameSceneAbstract;
    tasks: {
      id: number;
      task: NPCAction;
    }[];
  }) {
    const farmer = scene.npcs[0];
    if (!farmer) {
      return;
    }
    for await (const { task, id } of tasks) {
      if (task.action === 'move') {
        this.queue.push(async () => {
          await this.move(farmer, task.args, scene, id);
        });
      } else if (task.action === 'updateInventory') {
        this.queue.push(async () => {
          await this.updateInventory(id, task.args);
        });
      } else if (task.action === 'plant') {
        this.queue.push(async () => {
          await this.plantSeeds(id, task.args, scene);
        });
      } else if (task.action === 'harvest') {
        this.queue.push(async () => {
          await this.harvestCrops(id, task.args);
        });
      }
    }
  }

  async startTasks() {
    try {
      const data = getAccount(wagmiAdapter.wagmiConfig);
      const address = data.address;
      if (!address) {
        throw new Error('No address found');
      }
      this.queue = [];
      const tasks = await Actions.getTasks(address);
      const toAdd = tasks
        .filter((task) => task.status === 'pending')
        .map((t) => ({
          id: t.id,
          task: {
            action: t.taskType,
            args: t.args,
            message: t.message,
          },
        }));
      // @ts-expect-error safe
      taskEmitter.emit('add-tasks', toAdd);
      await sleep(300);
      for await (const task of this.queue) {
        await task();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async move(
    npc: NPCAbstract,
    args: NPCMoveArgs,
    scene: GameSceneAbstract,
    id: number
  ) {
    console.log('Starting move', args);
    await npc.moveTo({ tileX: args.x, tileY: args.y, scene });
    await db.tasks.update(id, {
      status: 'completed',
    });
  }

  async updateInventory(id: number, args: NPCUpdateInventoryArgs) {
    console.log('Starting updateInventory', args);
    await sleep(5000);
    try {
      const data = getAccount(wagmiAdapter.wagmiConfig);
      const address = data.address;
      if (!address) {
        throw new Error('No address found');
      }

      const items = args.map((item) => ({
        type: item.itemType,
        amount: Math.abs(item.amount),
        operation: item.operation,
      }));

      await sleep(5000);

      const message = `Update the player inventory with the following items: ${JSON.stringify(items)}\n\nThe Player address is: ${address}`;

      await callAgent(message);
      // await updateInventoryAgent(address, items);
      await db.tasks.update(id, {
        status: 'completed',
      });
    } catch (error) {
      console.log(error);
      await db.tasks.update(id, {
        status: 'failed',
      });
    }
  }

  async plantSeeds(id: number, args: NPCPlantArgs, scene: GameSceneAbstract) {
    console.log('Starting plantSeeds', args);
    try {
      const data = getAccount(wagmiAdapter.wagmiConfig);
      const address = data.address;
      if (!address) {
        throw new Error('No address found');
      }
      const pendingCrops = await Actions.getPendingCrops(address);
      const usedTiles = pendingCrops
        .flatMap((crop) => crop.tiles)
        .map(([x, y]) => ({ x, y }));
      const tiles = scene.farm.getEmptyFarmTiles(args.amount, usedTiles);
      if (tiles.length === 0 || tiles.length !== args.amount) {
        throw new Error('Not enough space');
      }
      await db.crops.add({
        cropType: args.seedType.replace('-seeds', '') as CropType,
        tiles: tiles.map(({ x, y }) => [x, y]),
        plantedAt: Date.now(),
        harvestAt: null,
        playerAddress: address,
      });
      await db.tasks.update(id, {
        status: 'completed',
      });
    } catch (error) {
      console.log(error);
      await db.tasks.update(id, {
        status: 'failed',
      });
    }
  }

  async harvestCrops(id: number, args: NPCHarvestArgs) {
    console.log('Starting harvestCrops', args);
    try {
      const data = getAccount(wagmiAdapter.wagmiConfig);
      const address = data.address;
      if (!address) {
        throw new Error('No address found');
      }
      const pendingCrops = await Actions.getPendingCrops(address);
      const cropsToHarvest = pendingCrops.filter(
        (c) => c.cropType === args.cropType && c.status === 'Harvest'
      );
      if (cropsToHarvest.length === 0) {
        throw new Error('Crop not found');
      }
      let totalCropYield = 0;
      let totalSeedYield = 0;

      for (const crop of cropsToHarvest) {
        const cropYield = await Actions.getCropYield(address, crop.id);
        totalCropYield += cropYield.totalCropYield;
        totalSeedYield += cropYield.totalSeedYield;
      }

      const items = [
        {
          type: `${args.cropType}-seeds`,
          amount: totalSeedYield,
          operation: 'add',
        },
        {
          type: args.cropType,
          amount: totalCropYield,
          operation: 'add',
        },
      ];

      const message = `Update the player Inventory with the following items: \n\n${JSON.stringify(items)}\n\nThe Player address is: ${address}`;

      const result = await callAgent(message);
      console.log(result);

      await db.tasks.update(id, {
        status: 'completed',
      });
    } catch (error) {
      console.log(error);
      await db.tasks.update(id, {
        status: 'failed',
      });
    }
  }
}
