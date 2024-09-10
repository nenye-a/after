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

export const START_OUTING = graphql(`
  mutation StartOuting($locationName: String!) {
    startOuting(locationName: $locationName) {
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

export const END_OUTING = graphql(`
  mutation EndOuting {
    endOuting {
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
