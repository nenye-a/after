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

export const GET_OUTINGS = graphql(`
  query GetOutings($includeAdditionalInfo: Boolean, $status: [String!]) {
    getOutings(includeAdditionalInfo: $includeAdditionalInfo, status: $status) {
      _id
      user_id
      name
      status
      start_date
      end_date
      linked_outing_id
      favorite
      automatically_ended
      num_locations
      num_participants
    }
  }
`);

export const START_OUTING = graphql(`
  mutation StartOuting($coordinates: CoordinatesInput) {
    startOuting(coordinates: $coordinates) {
      outing {
        _id
        name
        start_date
        end_date
        status
        linked_outing_id
      }
      location {
        _id
        user_id
        outing_id
        name
        address
        coordinates {
          latitude
          longitude
        }
        city
        arrival_time
        departure_time
        info {
          type
          rating
          num_ratings
          price_level
          image_urls
          google_photo_names
          tags
        }
        external_ids {
          google_place_id
          yelp_id
          here_id
        }
        recommendation_id
        nickname
        notes
        favorite
      }
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
