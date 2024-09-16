import _, { capitalize } from 'lodash';

export const years = 1000 * 3600 * 24 * 365;
export const days = 1000 * 3600 * 24;
export const hours = 1000 * 3600;
export const minutes = 1000 * 60;
export const seconds = 1000;
export const milliseconds = 1;
export const microseconds = 0.001;

export type DateDifferenceOptions = {
  as?: string;
  abs?: boolean;
  additionalMilliseconds?: number;
  digits?: number;
};

export type UnitName =
  | 'year'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second'
  | 'millisecond'
  | 'microsecond';

export const ORDERED_TIME_UNITS: { name: UnitName; value: number }[] = [
  { name: 'year', value: years },
  { name: 'day', value: days },
  { name: 'hour', value: hours },
  { name: 'minute', value: minutes },
  { name: 'second', value: seconds },
  { name: 'millisecond', value: milliseconds },
  { name: 'microsecond', value: microseconds },
];

export function convertDateToStringPretty(date: Date) {
  date = new Date(date);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayOfMonth = date.getDate();

  return `${dayName}, ${monthName} ${dayOfMonth}`;
}

export const getTimeZone = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone;
};

export const getLocalTime = (date: Date, timeZone?: string) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone,
  };

  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

/**
 * Returns the time difference between two dates. By
 * default will return absolute value. If abs is set
 * to false, will return date 1 - date 2.
 * @param laterDate
 * @param earlierDate
 * @param {{
 *   abs: Boolean,
 *   as: String
 * }} options
 * @returns
 */
export const dateDifference = function (
  laterDate: Date,
  earlierDate: Date,
  {
    as = 'millisecond',
    abs = true,
    additionalMilliseconds = 0,
    digits = 2,
  } = {},
) {
  laterDate = new Date(laterDate);
  earlierDate = new Date(earlierDate);

  let difference =
    additionalMilliseconds + (laterDate.getTime() - earlierDate.getTime());
  if (abs) difference = Math.abs(difference);
  let unit = ORDERED_TIME_UNITS.find(({ name }) => name === as);
  if (unit) {
    return _.round(difference / unit.value, digits);
  } else {
    let unitNames = ORDERED_TIME_UNITS.map(({ name }) => name);
    throw new Error(
      `Provide a correct 'as'. Options are ${unitNames
        .slice(0, -1)
        .join(', ')}, and ${unitNames[unitNames.length - 1]}`,
    );
  }
};

export const dayDifference = function (
  laterDate: Date,
  earlierDate: Date,
  options?: DateDifferenceOptions,
) {
  return dateDifference(laterDate, earlierDate, {
    abs: true,
    digits: 2,
    ...options,
    as: 'day',
  });
};

export const hourDifference = function (
  laterDate: Date,
  earlierDate: Date,
  options?: DateDifferenceOptions,
) {
  return dateDifference(laterDate, earlierDate, {
    abs: true,
    digits: 2,
    ...options,
    as: 'hour',
  });
};

export const minuteDifference = function (
  laterDate: Date,
  earlierDate: Date,
  options?: DateDifferenceOptions,
) {
  return dateDifference(laterDate, earlierDate, {
    abs: true,
    digits: 2,
    ...options,
    as: 'minute',
  });
};

export const secondsDifference = function (
  laterDate: Date,
  earlierDate: Date,
  options?: DateDifferenceOptions,
) {
  return dateDifference(laterDate, earlierDate, {
    abs: true,
    digits: 2,
    ...options,
    as: 'second',
  });
};

export const formattedDateDifference = function (
  laterDate: Date,
  earlierDate: Date,
  includedUnits: UnitName[],
  asString: boolean = true,
  options: {
    delimiter: string;
    capitalize: boolean;
    ignoreExcess?: boolean;
  } = {
    delimiter: ' ',
    capitalize: true,
    ignoreExcess: true,
  },
) {
  let difference = dateDifference(laterDate, earlierDate);
  let unitDetails = ORDERED_TIME_UNITS.filter(({ name }) =>
    includedUnits.includes(name),
  );

  let resultMap = new Map<UnitName, number>();

  unitDetails.forEach(({ name, value: timeUnitValue }, index) => {
    let numUnits =
      index !== unitDetails.length - 1
        ? Math.floor(difference / timeUnitValue)
        : _.round(difference / timeUnitValue, 0);
    difference -= numUnits * timeUnitValue;
    if (!options?.ignoreExcess || numUnits > 0) resultMap.set(name, numUnits);
  });

  if (asString) {
    let results = [];
    for (let [unitName, differenceValue] of resultMap.entries()) {
      let unitPrePend = ['microsecond', 'millisecond'].includes(unitName)
        ? unitName.slice(0, 3)
        : unitName.slice(0, 1);
      if (options?.capitalize) unitPrePend = _.capitalize(unitPrePend);
      results.push(`${differenceValue}${unitName[0]}`);
    }
    return results.join(options?.delimiter ?? ' ');
  }

  return resultMap;
};

export const hourOfDate = function (date = new Date()) {
  let newDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
  );

  return newDate;
};

export const generateDurationString = (laterDate: Date, earlierDate: Date) => {
  let duration = formattedDateDifference(laterDate, earlierDate, [
    'day',
    'hour',
    'minute',
  ]);
  return `${getLocalTime(earlierDate)} - ${getLocalTime(laterDate)}${duration ? ` (${duration})` : ''}`;
};
