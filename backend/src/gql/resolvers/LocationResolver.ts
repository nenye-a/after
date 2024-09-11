import 'reflect-metadata';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { LocationType } from '../types/Location';
import { CoordinatesInput } from '../types/Path';
import { Context } from '../../context';
import { getPlacesFromCoordinates } from '../../api/google';

@Authorized()
@Resolver(LocationType)
export class LocationResolver {
  // @Query(() => [LocationType])
  // async getOutingLocations() {}

  // @Query(() => LocationType)
  // async getLocationDetails() {}

  // @Mutation(() => LocationType)
  // async createLocation() {}

  @Mutation(() => LocationType, { nullable: true })
  async createLocationFromPoint(
    @Arg('coordinates', () => CoordinatesInput) coordinates: CoordinatesInput,
    @Ctx() ctx: Context,
  ) {
    let activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: 'active',
    });

    if (activeOuting && ctx.user) {
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
        let formattedLocation = ctx.models.locations.fromGoogleTextSearchPlace(
          googlePlace,
          ctx.user._id,
          activeOuting._id,
        );

        return await ctx.models.locations.create(formattedLocation);
      } else {
        return null;
      }
    }
  }
}
