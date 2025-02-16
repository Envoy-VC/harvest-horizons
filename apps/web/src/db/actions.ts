import Phaser from 'phaser';
import { cropDetails } from '~/data/crops';
import type { CropType } from '~/types/game';
import { db } from '.';

function getWeekNumber(date: Date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDays = Math.floor(
    (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
}

export const getPreviousClaims = async (playerAddress: string) => {
  const currentWeekNumber = getWeekNumber(new Date());
  const currentDayOfWeek = new Date().getDay() - 1;
  // Only for Current Week Claims
  const res = await db.dailyClaims
    .where('playerAddress')
    .equals(playerAddress)
    .and((claim) => claim.weekNumber === currentWeekNumber)
    .sortBy('claimedAt');

  const claimedToday = res.some(
    (claim) => claim.dayNumber === currentDayOfWeek
  );

  const lastClaimDay = res.at(-1)?.dayNumber ?? null;
  let nextClaimDay: number;
  if (lastClaimDay === null) {
    nextClaimDay = currentDayOfWeek;
  } else if (lastClaimDay === 6) {
    nextClaimDay = 0;
  } else {
    nextClaimDay = lastClaimDay + 1;
  }

  return {
    claimedToday,
    nextClaimDay,
    claims: res,
  };
};

export const claimDailyReward = async (
  playerAddress: string,
  dayNumber: number
) => {
  const currentWeekNumber = getWeekNumber(new Date());
  const currentDayOfWeek = new Date().getDay() - 1;

  const previousClaims = await db.dailyClaims
    .where('playerAddress')
    .equals(playerAddress)
    .and((claim) => claim.weekNumber === currentWeekNumber)
    .sortBy('claimedAt');

  if (previousClaims.some((claim) => claim.dayNumber === dayNumber)) {
    throw new Error('Already Claimed');
  }

  if (currentDayOfWeek !== dayNumber) {
    throw new Error('Already Claimed Today');
  }

  await db.dailyClaims.add({
    playerAddress,
    dayNumber,
    weekNumber: getWeekNumber(new Date()),
    claimedAt: Date.now(),
  });
};

export const getChats = async (playerAddress: string) => {
  const res = await db.chats
    .where('playerAddress')
    .equals(playerAddress)
    .sortBy('createdAt');

  return res;
};

export const getTasks = async (playerAddress: string) => {
  const res = await db.tasks
    .where('playerAddress')
    .equals(playerAddress)
    .limit(8)
    .sortBy('createdAt');

  return res;
};

export const clearTasks = async (playerAddress: string) => {
  const pendingTasks = await db.tasks
    .where('playerAddress')
    .equals(playerAddress)
    .and((task) => task.status === 'pending' || task.status === 'failed')
    .toArray();

  await db.tasks.bulkDelete(pendingTasks.map((t) => t.id));
};

const isBetween = (x: number, [a, b]: [number, number]) => {
  return x >= a && x <= b;
};

export const getPendingCrops = async (playerAddress: string) => {
  const data = await db.crops
    .where('playerAddress')
    .equals(playerAddress)
    .and((crop) => {
      return crop.harvestAt === null;
    })
    .toArray();

  const pendingCrops = data.map((crop) => {
    let status: 'Sprout' | 'Seedling' | 'Growth' | 'Harvest';
    const plantedAt = crop.plantedAt;
    const timeElapsed = Date.now() - plantedAt;
    const sproutTime = cropDetails[crop.cropType].growthStages.Sprout[1];

    const seedlingTime = cropDetails[crop.cropType].growthStages.Seedling[1];
    const isSeedlingStage = isBetween(timeElapsed, [sproutTime, seedlingTime]);

    const growthTime = cropDetails[crop.cropType].growthStages.Growth[1];
    const isGrowthStage = isBetween(timeElapsed, [seedlingTime, growthTime]);

    const harvestTime = cropDetails[crop.cropType].growthStages.Harvest[1];
    const isHarvestStage = isBetween(timeElapsed, [growthTime, harvestTime]);

    if (isHarvestStage) {
      status = 'Harvest';
    } else if (isGrowthStage) {
      status = 'Growth';
    } else if (isSeedlingStage) {
      status = 'Seedling';
    } else {
      status = 'Sprout';
    }

    let nextPhaseIn: number;
    if (status === 'Growth') {
      nextPhaseIn = Math.abs(growthTime - timeElapsed);
    } else if (status === 'Seedling') {
      nextPhaseIn = Math.abs(seedlingTime - timeElapsed);
    } else if (status === 'Sprout') {
      nextPhaseIn = Math.abs(sproutTime - timeElapsed);
    } else {
      nextPhaseIn = 0;
    }

    return { ...crop, status, nextPhaseIn };
  });
  return pendingCrops;
};

export const getCropYield = async (address: string, id: number) => {
  const pendingCrops = await getPendingCrops(address);

  const cropToHarvest = pendingCrops.find((c) => c.id === id);
  if (!cropToHarvest) {
    throw new Error('Crop not found');
  }
  const isReady = cropToHarvest.status === 'Harvest';

  if (!isReady) {
    throw new Error('Crop not ready to harvest');
  }

  const crop = cropToHarvest.cropType;

  let totalCropYield = 0;
  let totalSeedYield = 0;

  const totalSeeds = cropToHarvest.tiles.length;
  for (let i = 0; i < totalSeeds; i++) {
    // Get random number between min and max
    totalCropYield +=
      cropDetails[crop].yieldVariance.min +
      Phaser.Math.Between(
        cropDetails[crop].yieldVariance.min,
        cropDetails[crop].yieldVariance.max
      );
    totalSeedYield += Phaser.Math.Between(
      cropDetails[crop].yieldVariance.min,
      cropDetails[crop].yieldVariance.max
    );
  }

  return {
    crop,
    totalCropYield,
    totalSeedYield,
  };
};

export const checkIfCanPlant = async (
  address: string,
  crop: CropType,
  tiles: { x: number; y: number }[]
) => {
  if (tiles.length === 0) {
    return;
  }

  const existingCrops = await getPendingCrops(address);
  const totalOccupiedTiles = existingCrops.reduce((acc, crop) => {
    return acc + crop.tiles.length;
  }, 0);

  if (35 - totalOccupiedTiles < tiles.length) {
    throw new Error('Not enough space');
  }

  return {
    crop,
    tiles,
  };
};
