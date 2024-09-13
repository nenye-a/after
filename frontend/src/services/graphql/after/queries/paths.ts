import { graphql } from '../generated';

export const CREATE_PATH = graphql(`
  mutation CreatePath($points: [PathInput!]!) {
    createPath(points: $points)
  }
`);
