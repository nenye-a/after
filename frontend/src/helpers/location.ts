import { PriceLevel } from '@/services/graphql/after/generated/graphql';

export const convertLocationPriceLevel = (priceLevel: PriceLevel) => {
  switch (priceLevel) {
    case PriceLevel.cheap:
      return 1;
    case PriceLevel.moderate:
      return 2;
    case PriceLevel.expensive:
      return 3;
    case PriceLevel.veryExpensive:
      return 4;
    default:
      return 1;
  }
};
