import { defineStore } from 'pinia';
import type { DiscoveryData } from '@/types/data';
import { getUTCDateString } from '@/helpers/date';

interface State {
  filteredData: DiscoveryData[];
  isLoading: boolean;
}

export const useDataStore = defineStore('data', {
  state: (): State => ({
    filteredData: [],
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
