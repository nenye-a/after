import _ from 'lodash';

const EARTH_RADIUS_KM = 6371; // Earth's radius in kilometers

export function numberWithCommas(num: number, digits: number = 2): string {
  let roundedNumber;
  roundedNumber = _.round(num, digits);
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
