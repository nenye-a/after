import { graphql } from '../generated';

export const GET_LOCATION_PREVIEW = graphql(`
  query GetGooglePreviewLocation($coordinates: CoordinatesInput!) {
    getGooglePreviewLocation(coordinates: $coordinates) {
      google_place_id
      displayName
      address
      coordinates {
        latitude
        longitude
      }
      types
      rating
      num_ratings
    }
  }
`);

export const CREATE_LOCATION_FROM_POINT = graphql(`
  mutation CreateLocationFromPoint($coordinates: CoordinatesInput!) {
    createLocationFromPoint(coordinates: $coordinates) {
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
`);
