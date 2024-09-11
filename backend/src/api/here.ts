import axios from 'axios';
import * as dotenv from 'dotenv';
import { GoogleLocationPoint } from './google';

dotenv.config();

// TODO: Finish setting up here and comparing as an alternative to Google find place.
const HERE_API_KEY = process.env.HERE_API_KEY;

const hereRevGeoAxiosInstance = axios.create({
  baseURL: 'https://revgeocode.search.hereapi.com/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    apiKey: HERE_API_KEY,
  },
});

const hereBrowseAxiosInstance = axios.create({
  baseURL: 'https://browse.search.hereapi.com/v1/',
  headers: {
    'Content-Type': 'application/json',
  },
  params: {
    apiKey: HERE_API_KEY,
  },
});

export const reverseGeocode = async (coordinates: GoogleLocationPoint) => {
  return await hereRevGeoAxiosInstance
    .get('revgeocode', {
      params: {
        at: `${coordinates.latitude},${coordinates.longitude}`,
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

export const browsePlaceWithCoordinates = async (
  coordinates: GoogleLocationPoint,
) => {
  return await hereBrowseAxiosInstance
    .get('browse', {
      params: {
        at: `${coordinates.latitude},${coordinates.longitude}`,
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

if (require.main === module) {
  // // Test reverseGeocode
  // reverseGeocode({
  //   // latitude: 29.760747460072533,
  //   // longitude: -95.38268209252661,
  //   latitude: 29.74073626004217,
  //   longitude: -95.7755183281019,
  // }).then((data) => {
  //   console.log(data);
  // });

  // Test reverseGeocode
  browsePlaceWithCoordinates({
    latitude: 29.760747460072533,
    longitude: -95.38268209252661,
    // latitude: 29.74073626004217,
    // longitude: -95.7755183281019,
  }).then((data) => {
    console.log(data);
  });
}
