export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  displayWithTime: 'DD/MM/YYYY HH:mm',
  iso: 'YYYY-MM-DD',
  api: 'YYYY-MM-DDTHH:mm:ss[Z]',
  // Date formats
  DATE_SHORT: 'DD/MM/YYYY',
  DATE_MEDIUM: 'DD MMM YYYY',
  DATE_LONG: 'DD MMMM YYYY',
  DATE_FULL: 'dddd, DD MMMM YYYY',
  // Time formats
  TIME_12H: 'hh:mm A',
  TIME_24H: 'HH:mm',
  TIME_WITH_SECONDS_12H: 'hh:mm:ss A',
  TIME_WITH_SECONDS_24H: 'HH:mm:ss',
  // DateTime formats
  DATETIME_SHORT: 'DD/MM/YYYY HH:mm',
  DATETIME_MEDIUM: 'DD MMM YYYY, hh:mm A',
  DATETIME_LONG: 'DD MMMM YYYY, hh:mm A',
  DATETIME_FULL: 'dddd, DD MMMM YYYY, hh:mm A',
  // ISO formats
  ISO: 'YYYY-MM-DD',
  ISO_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
  // Special formats
  FILE_TIMESTAMP: 'YYYY-MM-DD_HHmmss',
  MONTH_YEAR: 'MMMM YYYY',
  DAY_MONTH: 'DD MMM',
  YEAR_ONLY: 'YYYY',
} as const;

export const formatDate = (date: Date | string, format: string = DATE_FORMATS.display): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};
