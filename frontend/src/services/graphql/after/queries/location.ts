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

export const GET_OUTING_LOCATIONS = graphql(`
  query GetOutingLocations($outingId: ID!) {
    getOutingLocations(outingId: $outingId) {
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
`);

export const GET_MANY_OUTING_LOCATIONS = graphql(`
  query GetManyOutingLocations($outingIds: [ID!]!) {
    getManyOutingLocations(outingIds: $outingIds) {
      outing_id
      locations {
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

export const DEPART_LOCATION = graphql(`
  mutation DepartLocation($locationId: ID!) {
    endLocationStay(locationId: $locationId) {
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
