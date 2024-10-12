import { Types } from 'mongoose';
import { getGooglePhotos, GooglePriceLevel } from '../api/google';
import { PriceLevel } from '../engine/types';
import { Coordinates } from '../types/location';

export const citySearchComponentList = [
  'locality',
  'postal_town',
  'administrative_area_level_3',
  'administrative_area_level_2',
  'sublocality_level_1',
  'sublocality',
];

export const stateSearchComponentList = [
  'administrative_area_level_1',
  'administrative_area_level_2',
  'administrative_area_level_3',
];

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
}

export interface OldAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Find priority types.
 * @param addressComponents
 * @returns
 */
export function findFirstMatchingComponent(
  addressComponents: AddressComponent[] | OldAddressComponent[],
  target: 'city' | 'state' | string[] = 'city',
): string | null {
  // Define the priority order for city-related types
  if (target === 'city') target = citySearchComponentList;
  if (target === 'state') target = stateSearchComponentList;

  // First, try to find an exact match
  for (const type of target) {
    const match =
      addressComponents.find(
        (component) =>
          component.types.includes(type) &&
          component.types.includes('political'),
      ) ??
      addressComponents.find((component) => component.types.includes(type));
    if (match)
      return 'shortText' in match
        ? (match.shortText ?? match.longText)
        : (match.short_name ?? match.long_name);
  }

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
    photos?: { name: string }[];
  },
  metaDetails?: {
    userId?: Types.ObjectId;
    outingId?: Types.ObjectId;
    hydratePhotos?: boolean;
  },
) => {
  let googlePhotoNames = place.photos?.map((photo) => photo.name);
  let googlePhotoUris: string[] = [];
  if (metaDetails?.hydratePhotos && googlePhotoNames) {
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
    city: findFirstMatchingComponent(place.addressComponents, 'city'),
    state: findFirstMatchingComponent(place.addressComponents, 'state'),
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

export const convertGoogleAddressToLocationBase = async (
  addressDoc: {
    place_id: string;
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
    types: string[];
    address_components: OldAddressComponent[];
  },
  metaDetails?: {
    userId?: Types.ObjectId;
    outingId?: Types.ObjectId;
    hydratePhotos?: boolean;
  },
) => {
  const formattedLocation = {
    user_id: metaDetails?.userId,
    outing_id: metaDetails?.outingId,
    name: addressDoc.formatted_address.split(',')[0],
    address: addressDoc.formatted_address,
    coordinates: {
      latitude: addressDoc.geometry.location.lat,
      longitude: addressDoc.geometry.location.lng,
    },
    city: findFirstMatchingComponent(addressDoc.address_components, 'city'),
    state: findFirstMatchingComponent(addressDoc.address_components, 'state'),
    info: {
      type: addressDoc.types[0],
      tags: addressDoc.types,
    },
    external_ids: {
      google_place_id: addressDoc.place_id,
    },
  };

  return formattedLocation;
};
