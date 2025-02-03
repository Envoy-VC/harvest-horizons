import { useAccount, useWriteContract } from 'wagmi';
import { lootTable } from '~/data/game';

import { useLiveQuery } from 'dexie-react-hooks';
import { claimDailyReward, getPreviousClaims } from '~/db/actions';
import { Button } from './ui/button';

import { itemsMap } from 'harvest-horizon-goat-plugin';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { harvestHorizonsConfig } from '~/data/contract';
import { IconButton } from './ui/icon-button';

import { waitForTransactionReceipt } from '@wagmi/core';
import { wagmiAdapter } from '~/providers/web3-provider';

export const DailyRewards = () => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const onClaim = async () => {
    try {
      if (!address) {
        throw new Error('Please connect your wallet');
      }
      if (!claims) {
        throw new Error('No claims to claim');
      }
      const loot = lootTable[claims.nextClaimDay] ?? [];
      const itemIds = loot.map((item) => BigInt(itemsMap[item.item]));
      const amounts = loot.map((item) => BigInt(item.quantity));
      const operations = loot.map(() => 0);
      const hash = await writeContractAsync({
        ...harvestHorizonsConfig,
        functionName: 'bulkEditInventory',
        args: [address, itemIds, amounts, operations],
      });
      await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, { hash });
      await claimDailyReward(address, claims.nextClaimDay);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const claims = useLiveQuery(async () => {
    if (!address) {
      return null;
    }
    const data = await getPreviousClaims(address);
    console.log(data);
    return data;
  }, [address]);

  return (
    <Dialog>
      <DialogTrigger className='absolute top-4 right-20'>
        <IconButton icon='mail-button' className='h-10 w-10' />
      </DialogTrigger>
      <DialogContent className='w-full max-w-5xl'>
        <div className='flex flex-col gap-6 pt-4'>
          <div className='text-center font-black font-minecraftia text-3xl'>
            Daily Login Rewards
          </div>
          <div className='flex w-full flex-row flex-wrap justify-center gap-2'>
            {Object.entries(lootTable).map(([day, items]) => {
              return (
                <div
                  key={day}
                  className='flex aspect-square w-full max-w-[10rem] flex-col justify-between rounded-md border-3 border-[#6B5052]'
                >
                  <div>
                    <div className='pt-4 text-center font-black font-minecraftia text-xl'>
                      Day {Number(day) + 1}
                    </div>
                    <div className='flex flex-row flex-wrap items-center justify-center gap-1 pt-4'>
                      {items.map((item, i) => {
                        return (
                          <div
                            key={`${String(i)}-item`}
                            className='flex flex-row gap-1'
                          >
                            {/* biome-ignore lint/nursery/noImgElement: <explanation> */}
                            <img
                              alt={item.item}
                              className='h-6 w-6 object-cover'
                              src={`/assets/ui/${item.item}.png`}
                            />
                            <div className='pt-1 font-black font-minecraftia text-sm'>
                              x{item.quantity}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    {claims?.nextClaimDay === Number(day) ? (
                      <Button onClick={onClaim}>Claim</Button>
                    ) : null}
                    {claims?.claims.some(
                      (claim) => claim.dayNumber === Number(day)
                    ) ? (
                      <Button className='disabled'>Claimed</Button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
