import axios from 'axios'; // TODO: Leverage safe request custom library.
import * as dotenv from 'dotenv';
import {
  GooglePlaceFields,
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

export const googleSearch = async (
  searchText: string,
  fields: GooglePlaceFields[] | '*',
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
      {
        textQuery: searchText,
      },
      {
        params: {
          fields: formattedFields,
        },
      },
    )
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

if (require.main === module) {
  const searchText = 'restaurants in New York';
  console.log('searching');
  googleSearch(searchText, ['name', 'displayName', 'formattedAddress', 'id'])
    .then((data) => {
      console.log(data?.places[0], data?.contextualContents?.[0]);
      console.log(data?.places.length, data?.contextualContents?.length);
    })
    .catch((err) => console.log(err));
}
