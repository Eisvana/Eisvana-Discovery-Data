import { defineStore } from 'pinia';
import type { DiscoveryData } from '@/types/data';

interface State {
  filteredData: DiscoveryData[];
  currentPageIndex: number;
  itemsPerPage: number;
}

export const useDataStore = defineStore('data', {
  state: (): State => ({
    filteredData: [],
    currentPageIndex: 0,
    itemsPerPage: 50,
  }),
});
