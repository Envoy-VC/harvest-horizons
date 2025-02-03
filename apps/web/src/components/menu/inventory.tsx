import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { harvestHorizonsConfig } from '~/data/contract';

import { itemsMapReverse } from 'harvest-horizon-goat-plugin';

export const Inventory = () => {
  const { address } = useAccount();
  const { data } = useReadContract({
    ...harvestHorizonsConfig,
    functionName: 'getPlayerInventory',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
  });

  const inventory = useMemo(() => {
    return (data ?? []).map((item, index) => {
      return {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        itemId: itemsMapReverse[Number(item.id)]!,
        quantity: Number(item.amount),
        id: index,
      };
    });
  }, [data]);

  return (
    <div className='flex flex-col gap-6 p-8'>
      <div className='px-6 text-center font-black font-minecraftia text-3xl'>
        Inventory
      </div>
      <div className='flex flex-row flex-wrap items-center gap-4'>
        {inventory.map((item) => {
          const name = item.itemId
            .split('_')
            .map((word) => {
              let res = word;
              if (word.endsWith('es')) {
                res = word.slice(0, -2);
              }
              if (word.endsWith('s')) {
                res = word.slice(0, -1);
              }
              // Capitalize first letter
              return res.charAt(0).toUpperCase() + res.slice(1);
            })
            .join(' ');
          return (
            <div
              key={item.id}
              className='flex aspect-square w-full max-w-[160px] flex-col items-center gap-2 rounded-md border-3 border-[#6B5052] p-2'
            >
              {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
              <img
                alt={item.itemId}
                className='h-16 w-16 object-cover'
                src={`/assets/ui/${item.itemId}.png`}
              />
              <div className='font-black font-minecraftia text-base'>
                x{item.quantity}
              </div>
              <div className='break-words font-black font-minecraftia text-base'>
                {name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
