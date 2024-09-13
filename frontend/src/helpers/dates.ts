import _ from 'lodash';

export const years = 1000 * 3600 * 24 * 365;
export const days = 1000 * 3600 * 24;
export const hours = 1000 * 3600;
export const minutes = 1000 * 60;
export const seconds = 1000;
export const milliseconds = 1;
export const microseconds = 0.001;

export function convertDateToStringPretty(date: Date) {
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
