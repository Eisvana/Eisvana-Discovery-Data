import { defineStore } from 'pinia';
import type { DiscoveryData } from '@/types/data';

interface State {
  filteredData: DiscoveryData[];
  currentPageIndex: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
    [key: string]: number;
  }
  itemsPerPage: {
    resultsTable: number;
    discovererStats: number;
    discovererChart: number;
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
    },
    itemsPerPage: {
      resultsTable: 50,
      discovererStats: 10,
      discovererChart: 50,
    }
  }),

  getters: {
    dataLength: (state: State) => (state.filteredData.length),
    amountTagged: (state: State) => (state.filteredData.filter((item) => item['Correctly Tagged']).length),

  }
});
