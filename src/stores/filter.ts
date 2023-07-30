import { defineStore } from 'pinia';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  galaxy: Array<'euclid' | 'calypso' | 'eissentam'>;
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  platform: Array<'ST' | 'PS' | 'XB' | 'GX' | 'NI'>;
  date: {
    startDate: string;
    endDate: string;
    [key: string]: string;
  }
  tagged: '' | boolean;
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

    platform: [],
    date: {
      startDate: '',
      endDate: ''
    },
    tagged: ''
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
