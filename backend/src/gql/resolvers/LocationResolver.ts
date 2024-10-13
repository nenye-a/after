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
import {
  GooglePreviewLocationType,
  LocationType,
  OutingLocationType,
} from '../types/Location';
import { CoordinatesInput } from '../types/Path';
import { Context } from '../../context';
import { getAddress, getPlacesFromCoordinates } from '../../api/google';
import getPreviewLocation from './resolverHelpers/getPreviewLocation';
import { Types } from 'mongoose';

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

  @Query(() => [OutingLocationType])
  async getManyOutingLocations(
    @Arg('outingIds', () => [ID]) outingIds: string[],
    @Ctx() ctx: Context,
  ) {
    let outingLocationResults = await ctx.models.locations.aggregate([
      {
        $match: {
          outing_id: { $in: outingIds.map((id) => new Types.ObjectId(id)) },
          user_id: ctx.user?._id,
        },
      },
      { $sort: { arrival_time: 1 } },
      {
        $group: {
          _id: '$outing_id',
          outing_id: { $first: '$outing_id' },
          locations: { $push: '$$ROOT' },
        },
      },
      { $project: { _id: 0 } },
    ]);

    return outingIds.map(
      (outingId) =>
        outingLocationResults.find(
          (result) => result.outing_id.toString() === outingId,
        ) ?? { outing_id: outingId, locations: [] },
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

    if (googlePlaceOptions?.places?.length) {
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
      let { results } = await getAddress(coordinates);
      if (results.length) {
        let addressDetails = results[0];
        return {
          google_place_id: addressDetails.place_id,
          displayName: addressDetails.formatted_address.split(',')[0],
          address: addressDetails.formatted_address,
          coordinates: {
            latitude: addressDetails.geometry.location.lat,
            longitude: addressDetails.geometry.location.lng,
          },
          types: addressDetails.types,
        };
      }

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
    @Arg('arrivalTime', { nullable: true }) arrivalTime?: Date,
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

      if (newLocation) {
        if (arrivalTime) newLocation.arrival_time = arrivalTime;

        await ctx.models.locations.updateMany(
          {
            departure_time: null,
            outing_id: activeOuting._id,
          },
          {
            $set: {
              departure_time: new Date(),
            },
          },
        );

        return await newLocation.save();
      }
      return null;
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
