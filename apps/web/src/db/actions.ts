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

  console.log(res);

  const claimedToday = res.some(
    (claim) => claim.dayNumber === currentDayOfWeek
  );

  const lastClaimDay = res.at(-1)?.dayNumber ?? null;
  console.log('Last Claim Day: ', lastClaimDay);
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

  console.log(currentDayOfWeek, dayNumber);

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
