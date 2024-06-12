import { defineStore } from 'pinia';
import type { DateRangeObj } from '@/types/date';
import { regions as allEisvanaRegions } from '@/variables/regions';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  regions: string[];
  categories: string[];
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  caseSensitivity: TextSearch<boolean>;
  platforms: string[];
  date: DateRangeObj;
  tagged: '' | boolean;
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    regions: [],
    categories: [],
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

    platforms: [],
    date: {
      startDate: '',
      endDate: '',
    },
    tagged: '',
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
    invertRegionSwitches() {
      this.regions = Object.values(allEisvanaRegions).filter((item) => !this.regions.includes(item));
    },
  },
});
