import 'reflect-metadata';
import {
  ID,
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql';
import { OutingPathType, PathInput, PathType } from '../types/Path';
import { Context } from '../../context';

@Authorized()
@Resolver(PathType)
export class PathResolver {
  @Query(() => [OutingPathType])
  async getOutingPaths(
    @Ctx() ctx: Context,
    @Arg('outing_ids', () => [ID], { nullable: true }) outing_ids?: string[],
  ) {
    return await ctx.models.pathPoints.aggregate([
      {
        $match: {
          user_id: ctx.user?._id,
          ...(outing_ids?.length ? { outing_id: { $in: outing_ids } } : {}),
        },
      },
      {
        $group: {
          _id: '$outing_id',
          outing_id: { $first: '$outing_id' },
          points: { $push: '$$ROOT' },
        },
      },
      { $project: { _id: 0 } },
    ]);
  }

  @Mutation(() => Boolean)
  async createPath(
    @Arg('points', () => [PathInput]) points: PathInput[],
    @Ctx() ctx: Context,
  ) {
    const activeOuting = await ctx.models.outings
      .findOne({
        user_id: ctx.user?._id,
        status: 'active',
      })
      .lean();

    if (activeOuting) {
      let newPoints = points.map((point) => ({
        ...point,
        user_id: ctx.user?._id,
        outing_id: activeOuting._id,
        linked_outing_id: activeOuting.linked_outing_id,
      }));

      return ctx.models.pathPoints
        .create(newPoints)
        .then((results) => results.length);
    } else {
      throw new Error('No active outing found');
    }
  }
}
