import 'reflect-metadata';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { OutingType } from '../types/Outing';
import { Context } from '../../context';
import { OutingStatus } from '../../types/outing';

@Authorized()
@Resolver(OutingType)
export class OutingResolver {
  @Query(() => OutingType)
  async getOuting(@Arg('outingId') outingId: string, @Ctx() ctx: Context) {
    return ctx.models.outings.findOne({
      _id: outingId,
      user_id: ctx.user?._id,
    });
  }

  /**
   * Get details of active outing for the user. Note that there should only be one active outing, and it might
   * be paused, hence the status check.
   * @param ctx
   * @returns
   */
  @Query(() => OutingType)
  async getActiveOuting(@Ctx() ctx: Context) {
    return ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: { $in: ['active', 'paused'] },
    });
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
    @Arg('status', () => [String], { nullable: true }) status?: OutingStatus[],
  ) {
    return ctx.models.outings.find({
      user_id: ctx.user?._id,
      ...(status ? { status: { $in: status } } : {}),
    });
  }

  /**
   * Start a new outing for the user. Use the current location as the starting point.
   * TODO: Update this to user the correct flow for getting the location.
   * @param locationName
   * @param ctx
   * @returns
   */
  @Mutation(() => OutingType)
  async startOuting(
    @Arg('locationName') locationName: string,
    @Ctx() ctx: Context,
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

    return ctx.models.outings.create({
      user_id: ctx.user?._id,
      name: `Outing from ${locationName}`,
    });
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
      { outing_id: activeOuting._id, end_time: null },
      { end_time: new Date() },
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
      { outing_id: activeOuting._id, end_time: null },
      { end_time: new Date() },
    );

    return activeOuting.save();
  }
}
