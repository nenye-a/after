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
