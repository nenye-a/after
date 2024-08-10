import axios from 'axios'; // TODO: Leverage safe request custom library.
import * as dotenv from 'dotenv';

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

enum GooglePlaceFields {}

interface GoogleSearchParams {
  fields: GooglePlaceFields[];
}

interface GoogleSearchResult {
  places: any[];
  contextualContents: any[];
}

const googleSearch = async (
  searchText: string,
  fields: string,
  otherParams?: GoogleSearchParams,
): Promise<GoogleSearchResult | null> => {
  return await placesAxiosInstance
    .post(
      `places:searchText`,
      {
        textQuery: searchText,
      },
      {
        params: {
          fields,
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

export { googleSearch };

if (require.main === module) {
  const searchText = 'restaurants in New York';
  console.log('searching');
  googleSearch(searchText, '*')
    .then((data) => {
      console.log(data?.places[0], data?.contextualContents[0]);
      console.log(data?.places.length, data?.contextualContents.length);
    })
    .catch((err) => console.log);
}
