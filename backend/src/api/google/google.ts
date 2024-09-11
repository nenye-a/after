import axios from 'axios'; // TODO: Leverage safe request custom library.
import * as dotenv from 'dotenv';
import {
  GoogleLocationCircle,
  GooglePlaceDetailsField,
  GooglePlaceField,
  GoogleTextSearchParams,
  GoogleSearchResult,
  GoogleNearbySearchParams,
  GoogleLocationPoint,
} from './types';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // TODO: Use Oauth2.0 for security.
const GOOGLE_MAPS_BASE_URL = 'https://maps.googleapis.com/maps/api/';
const GOOGLE_PLACES_V2_BASE_URL = 'https://places.googleapis.com/v1/';

const mapsAxiosInstance = axios.create({
  baseURL: GOOGLE_MAPS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    key: GOOGLE_API_KEY,
  },
});

const placesV2AxiosInstance = axios.create({
  baseURL: GOOGLE_PLACES_V2_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_API_KEY,
  },
});

/**
 * Execute a Google Maps API geocode request.
 * @param address
 * @returns
 */
export const geocode = async (address: string) => {
  return await mapsAxiosInstance
    .get('geocode/json', {
      params: { address: address.replace(' ', '+') },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * Execute a Google Maps API reverse geocode request.
 * @param coordinates
 * @returns
 */
export const reverseGeocode = async (coordinates: GoogleLocationPoint) => {
  return await mapsAxiosInstance
    .get('geocode/json', {
      params: {
        latlng: `${coordinates.latitude},${coordinates.longitude}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

/**
 * Get the coordinates of an address.
 * @param address
 * @returns
 */
export const getCoordinates = async (address: string) => {
  return await geocode(address).then((data) => {
    let coordinates = data?.results[0]?.geometry?.location;
    if (coordinates) {
      return { latitude: coordinates.lat, longitude: coordinates.lng };
    } else {
      return null;
    }
  });
};

/**
 * Get the address of coordinates.
 * @param coordinates
 * @returns
 */
export const getAddress = async (coordinates: GoogleLocationPoint) => {
  return await reverseGeocode(coordinates).then((data) => {
    return data?.results[0]?.formatted_address;
  });
};

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
  otherParams?: GoogleTextSearchParams,
): Promise<GoogleSearchResult | null> => {
  let formattedFields;
  if (fields === '*' || fields.includes('*')) {
    formattedFields = '*';
  } else {
    formattedFields = fields.map((field) => `places.${field}`).join(',');
  }

  return await placesV2AxiosInstance
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

export const googleNearbySearch = async (
  locationRestriction: GoogleLocationCircle,
  fields: GooglePlaceField[] | '*', // NOTE: Cheapest cost is Basic.
  otherParams?: GoogleNearbySearchParams,
) => {
  let formattedFields;
  if (fields === '*' || fields.includes('*')) {
    formattedFields = '*';
  } else {
    formattedFields = fields.map((field) => `places.${field}`).join(',');
  }

  return await placesV2AxiosInstance
    .post(
      `places:searchNearby`,
      { locationRestriction, ...otherParams },
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

  return await placesV2AxiosInstance
    .get(`places/${placeId}`, { params: { fields: formattedFields } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const getPlacesFromCoordinates = async (
  coordinates: GoogleLocationPoint,
  fields: GooglePlaceField[] | '*',
  searchPrompt: string = 'Place at',
) => {
  let address = await getAddress(coordinates);
  if (address) {
    console.log(address);
    return await googleSearch(`${searchPrompt} ${address}`, fields);
  } else {
    return [];
  }
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
  // {
  //   // Test Places
  //   const placeId = 'ChIJWVD7FadZwokRs_pS6XY7VOU';
  //   googlePlaceDetails(placeId, [
  //     'name',
  //     'displayName',
  //     'formattedAddress',
  //     'photos',
  //   ])
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => console.log(err));
  // }
  // {
  //   // Test Places
  //   const placeId = 'ChIJWVD7FadZwokRs_pS6XY7VOU';
  //   googleNearbySearch(
  //     {
  //       circle: {
  //         center: {
  //           latitude: 29.721507745211635,
  //           longitude: -95.77843928320651,
  //         },
  //         radius: 5000,
  //       },
  //     },
  //     ['name', 'displayName', 'formattedAddress', 'photos', 'location'],
  //     {
  //       includedTypes: ['restaurant'],
  //     },
  //   )
  //     .then((data) => {
  //       console.log(data.places);
  //     })
  //     .catch((err) => console.log(err));
  // }
  // {
  //   // // Test Geocode
  //   // const address = '732 S Spring Street, Los Anggeles, CA 90014';
  //   // geocode(address)
  //   //   .then((data) => {
  //   //     console.log(data);
  //   //   })
  //   //   .catch((err) => console.log(err));
  //   // Test Reverse Geocode
  //   const coordinates = {
  //     latitude: 29.721507745211635,
  //     longitude: -95.77843928320651,
  //   };
  //   reverseGeocode(coordinates)
  //     .then((data) => {
  //       console.log(data);
  //     })
  //     .catch((err) => console.log(err));
  // }
  // {
  //   // // Test address functions
  //   const coordinates = {
  //     latitude: 29.721507745211635,
  //     longitude: -95.77843928320651,
  //   };
  //   const address = '732 S Spring Street, Los Angeles, CA 90014';
  //   getAddress(coordinates).then((data) => {
  //     console.log(data);
  //   });
  //   getCoordinates(address).then((data) => {
  //     console.log(data);
  //   });
  // }
  // {
  //   // Test place finder
  //   const coordinates = {
  //     // latitude: 29.74073626004217,
  //     // longitude: -95.7755183281019,
  //     // latitude: 29.739959453302856,
  //     // longitude: -95.78006660958712,
  //     latitude: 29.760747460072533,
  //     longitude: -95.38268209252661,
  //   };
  //   getPlacesFromCoordinates(coordinates, '*', 'Place at').then((results) => {
  //     console.log(results);
  //   });
  // }
}
