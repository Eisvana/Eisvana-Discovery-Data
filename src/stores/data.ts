import { defineStore } from 'pinia';
import type { DiscoveryData } from '@/types/data';
import { toRaw } from 'vue';
import { getUTCDateString } from '@/helpers/date';

interface State {
  filteredData: DiscoveryData[];
  currentPageIndex: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
    playerChart: number;
    [key: string]: number;
  };
  itemsPerPage: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
    playerChart: number;
    [key: string]: number;
  };
  isLoading: boolean;
}

export const useDataStore = defineStore('data', {
  state: (): State => ({
    filteredData: [],
    currentPageIndex: {
      resultsTable: 0,
      discovererStats: 0,
      discovererChart: 0,
      playerChart: 0,
    },
    itemsPerPage: {
      resultsTable: 50,
      discovererStats: 10,
      discovererChart: 50,
      playerChart: 10,
    },
    isLoading: false,
  }),

  getters: {
    dataLength: (state: State) => state.filteredData.length,
    amountTagged: (state: State) => state.filteredData.filter((item) => item['Correctly Prefixed']).length,
    dateRange: (state: State): [string | undefined, string | undefined] => {
      const sortedData = state.filteredData
        .filter((item) => item.Timestamp)
        .toSorted((a, b) => a.Timestamp - b.Timestamp);

      // for some reason, TS doesn't know that the items at their indices are definitely not undefined in the function.
      // if they are undefined, they would fail the ternary operator and return undefined
      return [
        sortedData.at(0) ? getUTCDateString(sortedData.at(0)!.Timestamp) : undefined,
        sortedData.at(-1) ? getUTCDateString(sortedData.at(-1)!.Timestamp) : undefined,
      ];
    },
  },
});
