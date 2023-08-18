import { defineStore } from 'pinia';
import type { Hub } from '@/types/data';
import regionsJson from '@/assets/regions.json';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  hubs: { [keys: string]: boolean };
  regions: {
    [key: string]: {
      [keys: string]: boolean
    };
  };
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  caseSensitivity: TextSearch<boolean>;
  platforms: { [keys: string]: boolean };
  date: {
    startDate: string;
    endDate: string;
    [key: string]: string;
  }
  tagged: '' | boolean;
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    hubs: {},
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
      endDate: ''
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
    activePlatforms: (state) => Object.entries(state.platforms).filter(item => item[1]).map(item => item[0]),

    activeHubs: (state): Hub[] => {
      const SelectedHubs = Object.entries(state.hubs).filter(item => item[1]).map(item => item[0]);
      const arrayIntersection = Object.keys(regionsJson).filter((value) => SelectedHubs.includes(value));
      return arrayIntersection as Hub[];
    },

    activeRegions: (state) => {
      const regionArray = Object.values(state.regions)

      const selectedRegions: string[] = [];

      for (const region of regionArray) {
        selectedRegions.push(...Object.entries(region).filter(item => item[1]).map(item => item[0]));
      }

      const SelectedHubs = Object.entries(state.hubs).filter(item => item[1]).map(item => item[0]);
      const hubArrayIntersection = Object.keys(regionsJson).filter((value) => SelectedHubs.includes(value));

      const possibleRegions: string[] = [];

      for (const hub of hubArrayIntersection) {
        possibleRegions.push(...Object.values(regionsJson[hub as Hub]))
      }

      const regionArrayIntersection = possibleRegions.filter((value) => selectedRegions.includes(value));
      return regionArrayIntersection;
    },
  },

  actions: {
    invertRegionSwitches(hub: string) {
      const hubRegionData = this.regions[hub];
      for (const [key, value] of Object.entries(hubRegionData)) {
        hubRegionData[key] = !value;
      }
    }
  }
});
