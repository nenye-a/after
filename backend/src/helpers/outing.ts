import _ from 'lodash';
import { Types } from 'mongoose';
import { locations, pathPoints } from '../models';

export const getAdditionalOutingInfo = async (
  outingIds: (Types.ObjectId | string)[],
): Promise<
  Map<
    string,
    {
      numLocations: number;
      numParticipants: number;
    }
  >
> => {
  const locationDetails = await locations.aggregate([
    {
      $match: {
        outing_id: { $in: outingIds.map((id) => new Types.ObjectId(id)) },
      },
    },
    {
      $group: {
        _id: '$outing_id',
        numLocations: { $sum: 1 },
      },
    },
    {
      $set: {
        // TODO: Programatically obtain a different set of num participants once
        // the shared outings feature is implemented.
        numParticipants: 1,
      },
    },
  ]);

  return locationDetails.reduce(
    (acc, { _id, numLocations, numParticipants }) => {
      acc.set(_id.toString(), { numLocations, numParticipants });
      return acc;
    },
    new Map(),
  );
};
