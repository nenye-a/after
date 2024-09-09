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

export const GET_USER = graphql(`
  query GetUser {
    getUser {
      id
      email
      first_name
      last_name
      phone
      home_address
    }
  }
`);
