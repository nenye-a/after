import { graphql } from '../generated';

export const GET_ALL_USERS = graphql(`
  query GetAllUsers {
    getAllUsers {
      _id
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
      _id
      email
      first_name
      last_name
      phone
      home_address
    }
  }
`);

export const CREATE_USER = graphql(`
  mutation CreateUser($data: UserCreateInput!) {
    createUser(data: $data) {
      _id
      email
      first_name
      last_name
      phone
      home_address
    }
  }
`);
