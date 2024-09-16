import { Coordinates } from '@/types/components/location';
import _ from 'lodash';
import { useMemo } from 'react';

const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

export function numberWithCommas(num: number, digits: number = 2): string {
  let roundedNumber;
  roundedNumber = _.round(num, digits);
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
