export const getUTCDateString = (timestamp: number | string | Date) => new Date(timestamp).toISOString().split('T')[0];
export function getFormattedUTCDateString(timestamp: number | string | Date) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(undefined, { timeZone: 'UTC' }).format(date);
}

/**
 * returns the days in between two date strings, including the starting day string. Returns in the format yyyy-mm-dd.
 */
export function getDatesBetween(startDate: string | undefined, endDate: string | undefined) {
  if (!startDate || !endDate) return [];
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const dates = [];
  const currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    const currentDateIsoString = new Date(currentDate).toISOString().split('T')[0];
    dates.push(currentDateIsoString);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }
  return dates;
}
