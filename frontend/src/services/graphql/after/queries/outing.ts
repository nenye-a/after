import { graphql } from '../generated';

export const GET_ACTIVE_OUTING = graphql(`
  query GetActiveOuting {
    getActiveOuting {
      _id
      automatically_ended
      end_date
      favorite
      linked_outing_id
      name
      start_date
      status
      user_id
    }
  }
`);
