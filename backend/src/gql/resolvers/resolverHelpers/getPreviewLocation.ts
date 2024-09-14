import { Types } from 'mongoose';
import { getPlacesFromCoordinates } from '../../../api/google';
import { Context } from '../../../context';
import { convertGooglePlaceToLocationBase } from '../../../helpers/locations';
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

  if (googlePlaceOptions) {
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
    return null;
  }
};
