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
import { Types } from 'mongoose';

@Authorized()
@Resolver(PathType)
export class PathResolver {
  /**
   * Get all paths for given outings.
   * @param ctx
   * @param outing_ids
   * @returns
   */
  @Query(() => [OutingPathType])
  async getOutingPaths(
    @Ctx() ctx: Context,
    @Arg('outing_ids', () => [ID]) outing_ids: string[],
  ) {
    return await ctx.models.pathPoints.aggregate([
      {
        $match: {
          user_id: ctx.user?._id,
          outing_id: {
            $in: outing_ids.map((outing_id) => new Types.ObjectId(outing_id)),
          },
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

  /**
   * Create path for an outing by storing a set of points.
   * @param points
   * @param ctx
   * @returns
   */
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
