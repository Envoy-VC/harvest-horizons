import { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { toast } from 'sonner';
import { cropDetails } from '~/data/crops';

import { usePlayer } from '~/hooks';

import { Slider } from '~/components/ui/slider';
import type { CropsPlanted } from '~/db';
import { farmerEmitter } from '~/game/emitter';
import { world } from '~/game/state';
import type { CropType } from '~/types/game';
import { Button } from '../ui/button';

export const FarmInteraction = observer(() => {
  const { refresh } = usePlayer();
  return (
    <div className='flex h-full w-full flex-col items-center justify-center'>
      <div className='flex h-full w-full flex-row gap-3 p-4'>
        <PlantCrops />
        <div className='h-full rounded-2xl border-2 border-[#6B5052]' />
        <HarvestCrops />
      </div>
      <Button
        className='h-16 w-64 pt-3 font-minecraftia text-base disabled:opacity-50'
        onClick={async () => {
          await refresh();
        }}
      >
        Refresh
      </Button>
    </div>
  );
});

const HarvestCrops = observer(() => {
  const { plantedCrops } = usePlayer();
  return (
    <div className='flex basis-1/2 flex-col gap-4'>
      <div className='text-center font-black font-minecraftia text-2xl'>
        Harvest Crops
      </div>
      {[...plantedCrops.notReady].map((crop) => {
        return <NotReadyCrop key={crop.id} crop={crop} />;
      })}
      {[...plantedCrops.ready].map((crop) => {
        return <ReadyCrop key={crop.id} crop={crop} />;
      })}
    </div>
  );
});

const NotReadyCrop = observer(
  ({
    crop,
  }: {
    crop: CropsPlanted & {
      status: 'Sprout' | 'Seedling' | 'Growth' | 'Harvest';
      nextPhaseIn: number;
    };
  }) => {
    console.log(crop);
    // start a timer for when the crop is ready
    const [readyIn, setReadyIn] = useState<number>(crop.nextPhaseIn ?? 0);
    // Timer X Hr X Min X Sec
    useEffect(() => {
      const interval = setInterval(() => {
        if (readyIn >= 1000) {
          setReadyIn(readyIn - 1000);
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [readyIn]);

    const formattedTime = new Date(readyIn).toISOString().substring(11, 19);

    return (
      <div className='flex flex-row items-center gap-4'>
        {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
        <img
          alt={crop.cropType}
          className='h-12 w-12'
          src={`/assets/ui/${crop.cropType}.png`}
        />

        <div className='text-center font-black font-minecraftia text-sm'>
          x{crop.tiles.length}
        </div>
        <Button
          disabled
          className='mx-auto h-12 max-w-40 pt-4 disabled:opacity-50'
        >
          {formattedTime}
        </Button>
      </div>
    );
  }
);

const ReadyCrop = observer(
  ({
    crop,
  }: {
    crop: CropsPlanted & {
      status: 'Sprout' | 'Seedling' | 'Growth' | 'Harvest';
      nextPhaseIn: number;
    };
  }) => {
    const { harvestCrop } = usePlayer();

    return (
      <div className='flex flex-row items-center gap-4'>
        {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
        <img
          alt={crop.cropType}
          className='h-12 w-12'
          src={`/assets/ui/${crop.cropType}.png`}
        />

        <div className='text-center font-black font-minecraftia text-sm'>
          x{crop.tiles.length}
        </div>
        <Button
          className='mx-auto h-12 max-w-40 pt-4 disabled:opacity-50'
          onClick={async () => {
            await harvestCrop(crop.id);
          }}
        >
          Harvest
        </Button>
      </div>
    );
  }
);

const PlantCrops = observer(() => {
  const { plantedCrops, plantCrop } = usePlayer();
  const [values, setValues] = useState<{
    carrot: number;
    tomato: number;
    potato: number;
  }>({
    carrot: 0,
    tomato: 0,
    potato: 0,
  });

  const onPlant = async () => {
    try {
      const all = Object.values(values).reduce((acc, curr) => acc + curr, 0);
      if (all > 35 - plantedCrops.all.length) {
        throw new Error('Not enough space');
      }

      for (const [type, amount] of Object.entries(values)) {
        const usedTiles = plantedCrops.all.flatMap((crop) => crop.tiles);
        farmerEmitter.emit('getEmptyFarmTiles', {
          amount,
          used: usedTiles.map(([x, y]) => ({ x, y })),
        });
        await new Promise((resolve) => {
          setTimeout(resolve, 300);
        });

        if (world.availableFarmTiles.length !== amount) {
          toast.error(
            `Not enough space for ${cropDetails[type as CropType].name}`
          );
          return;
        }

        await plantCrop({
          type: type as CropType,
          tiles: world.availableFarmTiles,
        }).catch((error: unknown) => {
          throw new Error((error as Error).message);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message);
    }
  };

  return (
    <div className='flex basis-1/2 flex-col gap-4'>
      <div className='w-full text-center font-black font-minecraftia text-2xl'>
        Plant Crops
      </div>
      {Object.entries(cropDetails).map(([type, crop]) => {
        return (
          <div key={type} className='flex flex-row items-center gap-4'>
            {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
            <img
              alt={crop.name}
              className='h-12 w-12'
              src={`/assets/ui/${type}.png`}
            />
            <Slider
              className='w-[12rem]'
              max={107 - plantedCrops.all.length}
              step={1}
              value={[values[type as CropType]]}
              onValueChange={(value) => {
                setValues((prev) => ({ ...prev, [type]: value[0] }));
              }}
            />
            <div className='text-center font-black font-minecraftia text-sm'>
              x{values[type as CropType]}
            </div>
          </div>
        );
      })}
      <Button className='mx-auto h-12 max-w-40 pt-4' onClick={onPlant}>
        Plant Crops
      </Button>
    </div>
  );
});
