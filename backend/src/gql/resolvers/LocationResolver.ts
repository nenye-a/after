import 'reflect-metadata';
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { GooglePreviewLocationType, LocationType } from '../types/Location';
import { CoordinatesInput } from '../types/Path';
import { Context } from '../../context';
import { getPlacesFromCoordinates } from '../../api/google';
import getPreviewLocation from './resolverHelpers/getPreviewLocation';

@Authorized()
@Resolver(LocationType)
export class LocationResolver {
  /**
   * Get all locations for a given outing.
   * @param outingId
   * @param ctx
   * @returns a list of locations
   */
  @Query(() => [LocationType])
  async getOutingLocations(
    @Arg('outingId', () => ID) outingId: string,
    @Ctx() ctx: Context,
  ) {
    return await ctx.models.locations
      .find({ outing_id: outingId, user_id: ctx.user?._id })
      .then((locations) =>
        locations.sort(
          (a, b) => a.arrival_time.getTime() - b.arrival_time.getTime(),
        ),
      );
  }

  /**
   * Get all the associated details of a location.
   * @param locationId
   * @param ctx
   * @returns
   */
  @Query(() => LocationType, { nullable: true })
  async getLocationDetails(
    @Arg('locationId', () => ID) locationId: string,
    @Ctx() ctx: Context,
  ) {
    return await ctx.models.locations.findOne({
      _id: locationId,
      user_id: ctx.user?._id,
    });
  }

  @Query(() => GooglePreviewLocationType, { nullable: true })
  async getGooglePreviewLocation(
    @Arg('coordinates', () => CoordinatesInput) coordinates: CoordinatesInput,
  ) {
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

      return {
        google_place_id: googlePlace.name,
        displayName: googlePlace.displayName.text,
        address: googlePlace.formattedAddress,
        coordinates: googlePlace.location,
        types: googlePlace.types,
        rating: googlePlace.rating,
        num_ratings: googlePlace.userRatingCount,
      };
    } else {
      return null;
    }
  }

  /**
   * Create a new location from a set of coordinates. This function will attempt to find the
   * details of the location and then assign them. Note that the location will be associated with
   * the location, and may be wrong; the user will get the opportunity to update this information
   * in the future.
   * @param coordinates
   * @param ctx
   * @returns
   */
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
      let newLocation = await getPreviewLocation(
        coordinates,
        activeOuting._id,
        ctx,
      );

      // TODO: If there is a prior location for this outing, mark that as departed.

      return await newLocation?.save();
    } else return null;
  }

  /**
   * End a location stay - provide an end date to a location that the user is currently at. Note
   * that this function will not update end times for locations that have already been ended.
   *
   * @param locationId
   * @param ctx
   * @returns
   */
  @Mutation(() => LocationType, { nullable: true })
  async endLocationStay(
    @Arg('locationId', () => ID) locationId: string,
    @Ctx() ctx: Context,
  ) {
    let location = await ctx.models.locations.findOne({
      _id: locationId,
      user_id: ctx.user?._id,
    });

    if (location) {
      if (!location.departure_time) location.departure_time = new Date();
      return location.save();
    }

    return null;
  }
}