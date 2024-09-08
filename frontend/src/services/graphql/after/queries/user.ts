import { graphql } from '../generated';

export const GET_ALL_USERS = graphql(`
  query GetAllUsers {
    getAllUsers {
      id
      email
      first_name
      last_name
      phone
      home_address
    }
  }
`);
