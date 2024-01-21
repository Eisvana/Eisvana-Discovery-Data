import { defineStore } from 'pinia';
import regionsJson from '@/assets/regions.json';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  regions: {
    [keys: string]: boolean;
  };
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  caseSensitivity: TextSearch<boolean>;
  platforms: { [keys: string]: boolean };
  date: {
    startDate: string;
    endDate: string;
    [key: string]: string;
  };
  tagged: '' | boolean;
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    regions: {},
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

    platforms: {},
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
    activePlatforms: (state) =>
      Object.entries(state.platforms)
        .filter((item) => item[1])
        .map((item) => item[0]),

    activeRegions: (state) => {
      const selectedRegions: string[] = [];

      selectedRegions.push(
        ...Object.entries(state.regions)
          .filter((item) => item[1])
          .map((item) => item[0])
      );

      const possibleRegions: string[] = [];

      possibleRegions.push(...Object.values(regionsJson));

      const regionArrayIntersection = possibleRegions.filter((value) => selectedRegions.includes(value));
      return regionArrayIntersection;
    },
  },

  actions: {
    invertRegionSwitches() {
      const hubRegionData = this.regions;
      for (const [key, value] of Object.entries(hubRegionData)) {
        hubRegionData[key] = !value;
      }
    },
  },
});
