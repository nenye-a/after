import { GraphQLClient } from 'graphql-request';

// TODO: Dynamically create the instance based on the usres authorization.
export const afterInstance = new GraphQLClient(
  process.env.AFTER_GRAPHQL_API || 'http://localhost:4000/',
  {
    headers: {
      'content-type': 'application/json',
    },
  },
);

export const createAfterInstance = (token: string) => {
  return new GraphQLClient(
    process.env.AFTER_GRAPHQL_API || 'http://localhost:4000/',
    // 'https://aftrapi.nennovate.com',
    {
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
