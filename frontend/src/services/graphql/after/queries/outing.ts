import { graphql } from '../generated';

export const GET_ACTIVE_OUTING = graphql(`
  query GetActiveOuting {
    getActiveOuting {
      _id
      name
      start_date
      end_date
      status
      linked_outing_id
    }
  }
`);

export const START_OUTING = graphql(`
  mutation StartOuting($locationName: String!) {
    startOuting(locationName: $locationName) {
      _id
      name
      start_date
      end_date
      status
      linked_outing_id
    }
  }
`);

export const END_OUTING = graphql(`
  mutation EndOuting {
    endOuting {
      _id
      name
      start_date
      end_date
      status
      linked_outing_id
    }
  }
`);
