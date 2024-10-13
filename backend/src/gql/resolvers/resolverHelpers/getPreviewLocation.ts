import { Types } from 'mongoose';
import { getAddress, getPlacesFromCoordinates } from '../../../api/google';
import { Context } from '../../../context';
import {
  convertGoogleAddressToLocationBase,
  convertGooglePlaceToLocationBase,
} from '../../../helpers/locations';
import { locations } from '../../../models';
import { Coordinates } from '../../../types/location';

export default async (
  coordinates: Coordinates,
  outingId: Types.ObjectId,
  ctx: Context,
) => {
  let googlePlaceOptions = await getPlacesFromCoordinates(coordinates, [
    'name',
    'displayName',
    'formattedAddress',
    'location',
    'addressComponents',
    'types',
    'rating',
    'userRatingCount',
    'priceLevel',
    'photos',
  ]);

  if (googlePlaceOptions?.places?.length) {
    let googlePlace = googlePlaceOptions.places[0];

    let formattedLocation = await convertGooglePlaceToLocationBase(
      googlePlace,
      {
        userId: ctx.user?._id,
        outingId: outingId,
        hydratePhotos: true,
      },
    );

    return new locations(formattedLocation);
  } else {
    let { results } = await getAddress(coordinates);
    if (results.length) {
      let addressDetails = results[0];

      let formattedLocation = await convertGoogleAddressToLocationBase(
        addressDetails,
        {
          userId: ctx.user?._id,
          outingId: outingId,
          hydratePhotos: true,
        },
      );

      return new locations(formattedLocation);
    }

    return null;
  }
};
