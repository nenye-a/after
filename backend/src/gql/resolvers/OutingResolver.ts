import 'reflect-metadata';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { OutingType } from '../types/Outing';
import { Context } from '../../context';
import { OutingStatus } from '../../types/outing';

@Authorized()
@Resolver(OutingType)
export class OutingResolver {
  @Query(() => OutingType)
  async getOuting(@Arg('outing_id') outing_id: string, @Ctx() ctx: Context) {
    return ctx.models.outings.findOne({
      _id: outing_id,
      user_id: ctx.user?._id,
    });
  }

  @Query(() => OutingType)
  async getActiveOuting(@Ctx() ctx: Context) {
    return ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: { $or: ['active', 'paused'] },
    });
  }

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

  @Mutation(() => OutingType)
  async pauseOuting(@Ctx() ctx: Context) {
    const activeOuting = await ctx.models.outings.findOne({
      user_id: ctx.user?._id,
      status: 'active',
    });

    if (!activeOuting) {
      throw new Error('No active outing to pause');
    }

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
    return activeOuting.save();
  }
}
