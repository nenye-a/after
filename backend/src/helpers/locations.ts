import { Types } from 'mongoose';
import { getGooglePhotos, GooglePriceLevel } from '../api/google';
import { PriceLevel } from '../engine/types';
import { Coordinates } from '../types/location';

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

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

export const convertGooglePlaceToLocationBase = async (
  place: {
    name: string;
    displayName: { text: string };
    formattedAddress: string;
    location: Coordinates;
    addressComponents: AddressComponent[];
    types: string[];
    rating: number;
    userRatingCount: number;
    priceLevel: GooglePriceLevel;
    photos: { name: string }[];
  },
  metaDetails?: {
    userId?: Types.ObjectId;
    outingId?: Types.ObjectId;
    hydratePhotos?: boolean;
  },
) => {
  let googlePhotoNames = place.photos?.map((photo) => photo.name);
  let googlePhotoUris: string[] = [];
  if (metaDetails?.hydratePhotos) {
    googlePhotoUris = await getGooglePhotos(googlePhotoNames, {
      maxHeightPx: 400,
      maxWidthPx: 400,
    }).then((photos) => (photos ? photos.map((photo) => photo.photoUri) : []));
  }

  const formattedLocation = {
    user_id: metaDetails?.userId,
    outing_id: metaDetails?.outingId,
    name: place.displayName.text,
    address: place.formattedAddress,
    coordinates: place.location,
    city: findCityFromGoogleAddressComponents(place.addressComponents),
    info: {
      type: place.types[0],
      rating: place.rating,
      num_ratings: place.userRatingCount,
      price_level: convertGooglePriceLevel(place.priceLevel),
      google_photo_names: googlePhotoNames,
      image_urls: googlePhotoUris,
      tags: place.types,
    },
    external_ids: {
      google_place_id: place.name,
    },
  };

  return formattedLocation;
};
