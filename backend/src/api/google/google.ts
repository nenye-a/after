import axios from 'axios'; // TODO: Leverage safe request custom library.
import * as dotenv from 'dotenv';
import {
  GooglePlaceDetailsField,
  GooglePlaceField,
  GoogleSearchParams,
  GoogleSearchResult,
} from './types';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // TODO: Use Oauth2.0 for security.
const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1/';

const placesAxiosInstance = axios.create({
  baseURL: GOOGLE_PLACES_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_API_KEY,
  },
});

/**
 * Execute a Google Places API search.
 *
 * @param searchText Example: 'restaurants in New York'
 * @param fields
 * @param otherParams
 * @returns
 */
export const googleSearch = async (
  searchText: string,
  fields: GooglePlaceField[] | '*',
  otherParams?: GoogleSearchParams,
): Promise<GoogleSearchResult | null> => {
  let formattedFields;
  if (fields === '*' || fields.includes('*')) {
    formattedFields = '*';
  } else {
    formattedFields = fields.map((field) => `places.${field}`).join(',');
  }

  return await placesAxiosInstance
    .post(
      `places:searchText`,
      { textQuery: searchText, ...otherParams },
      { params: { fields: formattedFields } },
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * Execute a Google Places API details request.
 *
 * @param placeId Example: 'ChIJWVD7FadZwokRs_pS6XY7VOU'
 * @param fields
 * @returns
 */
export const googlePlaceDetails = async (
  placeId: string,
  fields: GooglePlaceDetailsField[] | '*',
) => {
  let formattedFields;
  if (fields === '*' || fields.includes('*')) {
    formattedFields = '*';
  } else {
    formattedFields = fields.join(',');
  }

  return await placesAxiosInstance
    .get(`places/${placeId}`, { params: { fields: formattedFields } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

if (require.main === module) {
  // {
  //   // Test Search
  //   const searchText = 'restaurants in New York';
  //   console.log('searching');
  //   googleSearch(searchText, ['name', 'displayName', 'formattedAddress', 'id'])
  //     .then((data) => {
  //       console.log(data?.places[0], data?.contextualContents?.[0]);
  //       console.log(data?.places.length, data?.contextualContents?.length);
  //     })
  //     .catch((err) => console.log(err));
  // }

  {
    // Test Places
    const placeId = 'ChIJWVD7FadZwokRs_pS6XY7VOU';
    googlePlaceDetails(placeId, [
      'name',
      'displayName',
      'formattedAddress',
      'photos',
    ])
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));
  }
}
