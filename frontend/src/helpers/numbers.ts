import _ from 'lodash';

export function numberWithCommas(num: number, digits: number = 2): string {
  let roundedNumber;
  roundedNumber = _.round(num, digits);
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
