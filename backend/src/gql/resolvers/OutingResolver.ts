import 'reflect-metadata';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { OutingType } from '../types/Outing';
import { Context } from '../../context';
import { OutingStatus } from '../../types/outing';
import { getAdditionalOutingInfo } from '../../helpers/outing';
import { CoordinatesInput } from '../types/Path';
import getPreviewLocation from './resolverHelpers/getPreviewLocation';
import { OutingAndLocationType } from '../types/SharedTypes';

@Authorized()
@Resolver(OutingType)
export class OutingResolver {
  @Query(() => OutingType)
  async getOuting(
    @Arg('outingId') outingId: string,
    @Ctx() ctx: Context,
    @Arg('includeAdditionalInfo', { defaultValue: false, nullable: true })
    includeAdditionalInfo: boolean,
  ) {
    let outingDetails = await ctx.models.outings.findOne({
      _id: outingId,
      user_id: ctx.user?._id,
    });

    if (outingDetails && includeAdditionalInfo) {
      let detailsMap = await getAdditionalOutingInfo([outingId]);
      let outingAdditionalDetails = detailsMap.get(outingId) ?? {};

      return {
        ...outingDetails.toObject(),
        ...outingAdditionalDetails,
      };
    } else {
      return outingDetails;
    }
  }

  /**
   * Get details of active outing for the user. Note that there should only be one active outing, and it might
   * be paused, hence the status check.
   * @param ctx
   * @returns
   */
  @Query(() => OutingType, { nullable: true })
  async getActiveOuting(
    @Ctx() ctx: Context,
    @Arg('includeAdditionalInfo', { defaultValue: false, nullable: true })
    includeAdditionalInfo: boolean,
  ) {
    let activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: { $in: ['active', 'paused'] },
    });

    if (activeOuting && includeAdditionalInfo) {
      let detailsMap = await getAdditionalOutingInfo([activeOuting._id]);
      let outingAdditionalDetails =
        detailsMap.get(activeOuting._id.toString()) ?? {};

      return {
        ...activeOuting.toObject(),
        ...outingAdditionalDetails,
      };
    } else {
      return activeOuting;
    }
  }

  /**
   * Get all the outings for the user.
   * @param ctx
   * @param status
   * @returns
   */
  @Query(() => [OutingType])
  async getOutings(
    @Ctx() ctx: Context,
    @Arg('includeAdditionalInfo', { defaultValue: false, nullable: true })
    includeAdditionalInfo: boolean,
    @Arg('status', () => [String], { nullable: true }) status?: OutingStatus[],
  ) {
    // TODO: Support pagination.
    let allOutings = await ctx.models.outings.find({
      user_id: ctx.user?._id,
      ...(status ? { status: { $in: status } } : {}),
    });

    if (allOutings.length && includeAdditionalInfo) {
      let detailsMap = await getAdditionalOutingInfo(
        allOutings.map((o) => o._id),
      );
      return allOutings.map((outing) => {
        let outingDetails = detailsMap.get(outing._id.toString()) ?? {};
        return {
          ...outing.toObject(),
          ...outingDetails,
        };
      });
    } else {
      return allOutings ?? [];
    }
  }

  /**
   * Start a new outing for the user. Use the current location as the starting point.
   * TODO: Update this to user the correct flow for getting the location.
   * @param locationName
   * @param ctx
   * @returns
   */
  @Mutation(() => OutingAndLocationType)
  async startOuting(
    @Ctx() ctx: Context,
    @Arg('coordinates', { nullable: true }) coordinates?: CoordinatesInput,
  ) {
    const activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: { $in: ['active', 'paused'] },
    });

    if (activeOuting) {
      if (activeOuting.status === 'active') {
        throw new Error('User already has an active outing');
      }
      activeOuting.status = 'active';
      return activeOuting.save();
    }

    let formattedDate = new Date().toLocaleString('en-US');
    let newOuting = new ctx.models.outings({
      user_id: ctx.user?._id,
      // Provide a temp name in case we don't find the location.
      name: `New Outing - ${formattedDate}`,
    });

    let startingLocation = coordinates
      ? await getPreviewLocation(coordinates, newOuting._id, ctx)
      : null;

    if (startingLocation) {
      newOuting.name = `Outing from ${startingLocation.name}`;
    }

    await startingLocation?.save();
    newOuting = await newOuting.save();

    return {
      outing: {
        ...newOuting.toObject(),
        num_locations: startingLocation ? 1 : 0,
        num_participants: 1, // TODO: Update this when shared trips are enabled..
      },
      location: startingLocation?.toJSON(),
    };
  }

  /**
   * Pause an active outing for the user, this will also mark any a location as
   * departed.
   * @param ctx
   * @returns
   */
  @Mutation(() => OutingType)
  async pauseOuting(@Ctx() ctx: Context) {
    const activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: 'active',
    });

    if (!activeOuting) {
      throw new Error('No active outing to pause');
    }

    // End any current stay at the current location.
    await ctx.models.locations.updateMany(
      { outing_id: activeOuting._id, departure_time: null },
      { departure_time: new Date() },
    );

    activeOuting.status = 'paused';
    return activeOuting.save();
  }

  @Mutation(() => OutingType)
  async endOuting(@Ctx() ctx: Context) {
    const activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: 'active',
    });

    if (!activeOuting) {
      throw new Error('No active outing to end');
    }

    activeOuting.status = 'ended';
    activeOuting.end_date = new Date();

    // End any current stay at the current location.
    await ctx.models.locations.updateMany(
      { outing_id: activeOuting._id, departure_time: null },
      { departure_time: new Date() },
    );

    return activeOuting.save();
  }
}
