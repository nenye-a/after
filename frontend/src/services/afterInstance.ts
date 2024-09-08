import ky from 'ky';
import { GraphQLClient } from 'graphql-request';

// TODO: Dynamically create the instance based on the usres authorization.
export const afterInstance = new GraphQLClient(
  process.env.AFTER_GRAPHQL_API || 'http://localhost:4000',
  {
    headers: {
      'content-type': 'application/json',
    },
  },
);
