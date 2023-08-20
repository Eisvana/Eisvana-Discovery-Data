import { defineStore } from 'pinia';
import type { DiscoveryData } from '@/types/data';
import { toRaw } from 'vue';

interface State {
  filteredData: DiscoveryData[];
  currentPageIndex: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
    playerChart: number;
    [key: string]: number;
  }
  itemsPerPage: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
    playerChart: number;
    [key: string]: number;
  }
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
    }
  }),

  getters: {
    dataLength: (state: State) => (state.filteredData.length),
    amountTagged: (state: State) => (state.filteredData.filter((item) => item['Correctly Tagged']).length),
    dateRange: (state: State): [string, string] => {
      const sortedData = structuredClone(toRaw(state.filteredData)).filter(item => item.Timestamp).sort((a, b) => a.UnixTimestamp - b.UnixTimestamp);
      return [sortedData[0].Timestamp, sortedData[sortedData.length - 1].Timestamp];
    }
  }
});
