import { defineStore } from 'pinia';
import type { DiscoveryData, Galaxy, Platform } from '@/types/data';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  galaxy: Galaxy[];
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  caseSensitivity: TextSearch<boolean>;
  platform: Array<Platform>;
  date: {
    startDate: string;
    endDate: string;
    [key: string]: string;
  }
  tagged: '' | boolean;
  data: DiscoveryData[];
  filteredData: DiscoveryData[];
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    galaxy: [],
    searchTerms: {
      name: '',
      glyphs: '',
      discoverer: '',
    },
    intersections: {
      name: 'includes',
      glyphs: 'includes',
      discoverer: 'includes',
    },
    caseSensitivity: {
      name: false,
      glyphs: false,
      discoverer: false,
    },

    platform: [],
    date: {
      startDate: '',
      endDate: ''
    },
    tagged: '',
    data: [],
    filteredData: []
  }),

  getters: {
    unixTimestamp: (state) => {
      const dateObj = state.date;
      const numberDateObj: {
        startDate: number;
        endDate: number;
        [key: string]: number;
      } = {
        startDate: 0,
        endDate: 0,
      };
      for (const date in dateObj) {
        const timestamp = new Date(dateObj[date]).valueOf();
        numberDateObj[date] = isNaN(timestamp) ? 0 : timestamp;
      }
      return numberDateObj;
    },
  },

  actions: {

  }
});
