import _ from 'lodash';
import { Types } from 'mongoose';
import { locations, pathPoints } from '../models';

export const getAdditionalOutingInfo = async (
  outingIds: (Types.ObjectId | string)[],
): Promise<
  Map<
    string,
    {
      num_locations: number;
      num_participants: number;
      images: string[];
      city: string;
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
        num_locations: { $sum: 1 },
        images: { $push: '$info.image_urls' },
        city: { $first: '$city' },
        state: { $first: '$state' },
      },
    },
    {
      $set: {
        // TODO: Programatically obtain a different set of num participants once
        // the shared outings feature is implemented.
        num_participants: 1,
        city: { $concat: ['$city', ', ', '$state'] },
      },
    },
  ]);

  let resultMap = locationDetails.reduce(
    (acc, { _id, num_locations, num_participants, images, city }) => {
      acc.set(_id.toString(), {
        num_locations,
        num_participants,
        city,
        images: images.flat(),
      });

      return acc;
    },
    new Map(),
  );

  outingIds.forEach((id) => {
    if (!resultMap.has(id.toString())) {
      resultMap.set(id.toString(), {
        num_locations: 0,
        num_participants: 1,
        images: [],
        city: '',
      });
    }
  });

  return resultMap;
};
