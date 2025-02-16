import type { Crop, CropType } from '~/types/game';

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

export const cropDetails: Record<CropType, Crop> = {
  carrot: {
    name: 'carrot',
    seedName: 'carrot_seeds',
    season: 'spring',
    quality: 'medium',
    yieldVariance: {
      min: 4,
      max: 6,
    },
    seasonalBoost: {
      idealWeather: ['spring'],
      growthSpeedMultiplier: 1.2,
    },
    growthStages: {
      Sprout: [0, ONE_MINUTE / 4], // Sprout for 15 sec
      Seedling: [ONE_MINUTE / 4, (1 * ONE_MINUTE) / 2], // Seedling for 30 sec
      Growth: [(1 * ONE_MINUTE) / 2, 1 * ONE_MINUTE], // Growing for 1 Min
      Harvest: [1 * ONE_MINUTE, Number.POSITIVE_INFINITY], // Harvestable after 7 mins
    },
    wateringRequirement: {
      frequency: 20 * ONE_MINUTE, // Needs watering every 20 minutes
    },
    rotationBenefit: [
      {
        after: 'potato',
        percentageMultiplier: 1.15,
      },
    ],
  },
  tomato: {
    name: 'tomato',
    seedName: 'tomato_seeds',
    season: 'summer',
    quality: 'high',
    yieldVariance: {
      min: 3,
      max: 5,
    },
    seasonalBoost: {
      idealWeather: ['summer'],
      growthSpeedMultiplier: 1.4,
    },
    growthStages: {
      Sprout: [0, ONE_MINUTE / 2], // Sprout for 30 Sec
      Seedling: [ONE_MINUTE / 2, 1 * ONE_MINUTE], // Seedling for 60 Sec
      Growth: [1 * ONE_MINUTE, 2 * ONE_MINUTE], // Growing for 2 mins
      Harvest: [2 * ONE_MINUTE, Number.POSITIVE_INFINITY], // Harvestable after 2 mins
    },
    wateringRequirement: {
      frequency: 30 * ONE_MINUTE, // Needs watering every 30 minutes
    },
    rotationBenefit: [],
  },
  potato: {
    name: 'potato',
    seedName: 'potato_seeds',
    season: 'autumn',
    quality: 'medium',
    yieldVariance: {
      min: 6,
      max: 10,
    },
    seasonalBoost: {
      idealWeather: ['autumn'],
      growthSpeedMultiplier: 1.3,
    },
    growthStages: {
      Sprout: [0, ONE_MINUTE / 4], // Sprout for 15 Sec
      Seedling: [ONE_MINUTE / 4, (3 / 2) * ONE_MINUTE], // Seedling for 75 Sec
      Growth: [2 * ONE_MINUTE, 7 * ONE_MINUTE], // Growing for 7 mins
      Harvest: [7 * ONE_MINUTE, Number.POSITIVE_INFINITY], // Harvestable after 7 mins
    },
    wateringRequirement: {
      frequency: 35 * ONE_MINUTE, // Needs watering every 35 minutes
    },
    rotationBenefit: [],
  },
};
