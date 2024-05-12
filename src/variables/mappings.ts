export const evRegions = 7;

export const platformMapping = {
  ST: 'Steam',
  PS: 'PlayStation',
  XB: 'Xbox',
  GX: 'GOG',
  NI: 'Nintendo Switch',
} as const;

export const orders = {
  asc: 'ascending',
  desc: 'descending',
} as const;

export const chartColours = {
  blue: '#1095C1',
  red: '#e85123',
  green: '#1A8F1A',
} as const;

export const appSections = {
  resultsTable: 'resultsTable',
  discovererStats: 'discovererStats',
  discovererChart: 'discovererChart',
  playerChart: 'playerChart',
} as const;

export const platformColours = {
  steam: '#003EFF',
  ps: '#0080FF',
  xb: '#56FF56',
  gog: '#EBFF3A',
  switch: '#FF3A3A',
} as const;
