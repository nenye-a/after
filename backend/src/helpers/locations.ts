import { GooglePriceLevel } from '../api/google';
import { PriceLevel } from '../engine/types';

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

// export type GooglePriceLevel =
//   | 'PRICE_LEVEL_UNSPECIFIED'
//   | 'PRICE_LEVEL_FREE'
//   | 'PRICE_LEVEL_INEXPENSIVE'
//   | 'PRICE_LEVEL_MODERATE'
//   | 'PRICE_LEVEL_EXPENSIVE'
//   | 'PRICE_LEVEL_VERY_EXPENSIVE';

/**
 * Find priority types.
 * @param addressComponents
 * @returns
 */
export function findCityFromGoogleAddressComponents(
  addressComponents: AddressComponent[],
): string | null {
  // Define the priority order for city-related types
  const cityTypes = [
    'locality',
    'postal_town',
    'administrative_area_level_3',
    'administrative_area_level_2',
    'sublocality_level_1',
    'sublocality',
  ];

  // First, try to find an exact match
  for (const type of cityTypes) {
    const match = addressComponents.find(
      (component) =>
        component.types.includes(type) &&
        !component.types.includes('political'),
    );
    if (match) return match.longText;
  }

  // If no exact match, look for partial matches
  for (const type of cityTypes) {
    const match = addressComponents.find(
      (component) =>
        component.types.some((t) => t.startsWith(type)) &&
        !component.types.includes('political'),
    );
    if (match) return match.longText;
  }

  // If still no match, try to find any sublocality
  const sublocality = addressComponents.find(
    (component) =>
      component.types.some((t) => t.startsWith('sublocality')) &&
      !component.types.includes('political'),
  );
  if (sublocality) return sublocality.longText;

  // If all else fails, return null
  return null;
}

export const convertGooglePriceLevel = (
  priceLevel: GooglePriceLevel,
): PriceLevel | null => {
  switch (priceLevel) {
    case 'PRICE_LEVEL_INEXPENSIVE':
      return PriceLevel.cheap;
    case 'PRICE_LEVEL_MODERATE':
      return PriceLevel.moderate;
    case 'PRICE_LEVEL_EXPENSIVE':
      return PriceLevel.expensive;
    case 'PRICE_LEVEL_VERY_EXPENSIVE':
      return PriceLevel.veryExpensive;
    default:
      return null;
  }
};
