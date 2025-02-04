import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount } from 'wagmi';
import { world } from '~/game/state';

import { db } from '~/db';
import * as Actions from '~/db/actions';
import { farmerEmitter } from '~/game/emitter';
import { updateInventory } from '~/lib/wagmi';
import type { CropType } from '~/types/game';

export const usePlayer = () => {
  const { address } = useAccount();

  const { data: plantedCrops, refetch: refetchPlantedCrops } = useQuery({
    queryKey: ['plantedCrops', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('No address found');
      }
      const crops = await Actions.getPendingCrops(address);
      const readyCrops = crops.filter((crop) => crop.status === 'Harvest');
      const notReadyCrops = crops.filter((crop) => crop.status !== 'Harvest');

      farmerEmitter.emit(
        'placeCrops',
        crops.map((crop) => {
          return {
            type: crop.cropType,
            stage: crop.status,
            tiles: crop.tiles.map(([x, y]) => ({ x, y })),
          };
        })
      );
      return {
        all: crops,
        ready: readyCrops,
        notReady: notReadyCrops,
      };
    },
    enabled: Boolean(address),
    initialData: {
      all: [],
      ready: [],
      notReady: [],
    },
  });

  const plantCrop = async (crop: {
    type: CropType;
    tiles: { x: number; y: number }[];
  }) => {
    try {
      if (!address) {
        throw new Error('No address found');
      }
      if (crop.tiles.length === 0) {
        return;
      }
      await Actions.checkIfCanPlant(address, crop.type, crop.tiles);
      console.log(crop.tiles);
      //   await updateInventory(address, [
      //     {
      //       type: `${crop.type}-seeds`,
      //       amount: crop.tiles.length,
      //       operation: 'remove',
      //     },
      //   ]);
      await db.crops.add({
        cropType: crop.type,
        tiles: crop.tiles.map(({ x, y }) => [x, y]),
        plantedAt: Date.now(),
        harvestAt: null,
        playerAddress: address,
      });
      world.setAvailableFarmTiles([]);
      await refetchPlantedCrops();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const harvestCrop = async (id: number) => {
    try {
      if (!address) {
        throw new Error('No address found');
      }
      const res = await Actions.getCropYield(address, id);
      await updateInventory(address, [
        { type: res.crop, amount: res.totalCropYield, operation: 'add' },
        {
          type: `${res.crop}-seeds`,
          amount: res.totalSeedYield,
          operation: 'add',
        },
      ]);
      await db.crops.update(id, {
        harvestAt: Date.now(),
      });
      await refresh();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const refresh = async () => {
    await refetchPlantedCrops();
  };

  return {
    plantedCrops,
    plantCrop,
    harvestCrop,
    refresh,
  };
};
