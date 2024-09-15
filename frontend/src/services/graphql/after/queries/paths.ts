import { graphql } from '../generated';

export const GET_OUTING_PATHS = graphql(`
  query GetOutingPaths($outingIds: [ID!]) {
    getOutingPaths(outing_ids: $outingIds) {
      outing_id
      points {
        _id
        user_id
        coordinates {
          latitude
          longitude
        }
        outing_id
        time
        linked_outing_id
        location_id
      }
    }
  }
`);

export const CREATE_PATH = graphql(`
  mutation CreatePath($points: [PathInput!]!) {
    createPath(points: $points)
  }
`);
