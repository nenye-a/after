import { Coordinates } from '@/types/components/location';
import _ from 'lodash';
import { useMemo } from 'react';

const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

export function numberWithCommas(num: number, digits: number = 2): string {
  let roundedNumber;
  roundedNumber = _.round(num, digits);
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateDistanceMeters(
  coord1: Coordinates,
  coord2: Coordinates,
): number {
  return useMemo(() => {
    const lat1 = toRadians(coord1.latitude);
    const lon1 = toRadians(coord1.longitude);
    const lat2 = toRadians(coord2.latitude);
    const lon2 = toRadians(coord2.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return _.round(EARTH_RADIUS_KM * c * 1000); // Distance in meters.
  }, [coord1.latitude, coord1.longitude, coord2.latitude, coord2.longitude]);
}

interface ViewportDimensions {
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Converts a distance in meters to approximate changes in latitude and longitude degrees.
 * @param km - The distance in kilometers.
 * @param baseCoordinate - The base coordinate (latitude and longitude) to calculate from.
 * @returns An object containing latitudeDelta and longitudeDelta.
 */
export function kmToLatLngDeltas(
  km: number,
  baseCoordinate: Coordinates,
): ViewportDimensions {
  // Earth's radius in meters

  // Convert latitude and longitude to radians
  const lat = baseCoordinate.latitude * (Math.PI / 180);

  // Calculate latitude change
  const latDelta = (km / EARTH_RADIUS_KM) * (180 / Math.PI);

  // Calculate longitude change
  const lngDelta = ((km / EARTH_RADIUS_KM) * (180 / Math.PI)) / Math.cos(lat);

  return {
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
