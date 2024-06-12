import { defineStore } from 'pinia';
import type { DateRangeObj } from '@/types/date';
import { regions as allEisvanaRegions } from '@/variables/regions';
import { availableCategories } from '@/variables/categories';
import { invertSwitches } from '@/helpers/filter';
import { platformMapping } from '@/variables/mappings';

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

const defaultFilterState: State = {
  regions: Object.values(allEisvanaRegions),
  categories: ['system'],
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

  platforms: Object.keys(platformMapping),
  date: {
    startDate: '',
    endDate: '',
  },
  tagged: '',
};

export const useFilterStore = defineStore('filter', {
  state: (): State => structuredClone(defaultFilterState),

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
      this.regions = invertSwitches(this.regions, Object.values(allEisvanaRegions));
    },

    invertCategorySwitches() {
      this.categories = invertSwitches(this.categories, Object.keys(availableCategories));
    },

    resetStore() {
      this.$patch(structuredClone(defaultFilterState));
    },
  },
});
