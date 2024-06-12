import { defineStore } from 'pinia';
import type { DateRangeObj } from '@/types/date';
import { regions as allEisvanaRegions } from '@/variables/regions';
import { availableCategories } from '@/variables/categories';
import { invertSwitches } from '@/helpers/filter';
import { platformMapping } from '@/variables/mappings';
import { is } from 'quasar';

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
  date: null,
  tagged: '',
};

export const useFilterStore = defineStore('filter', {
  state: (): State => structuredClone(defaultFilterState),

  getters: {
    unixTimestamp: (state): { startDate: number; endDate: number } => {
      const dateObj = state.date;

      if (is.object(dateObj)) {
        // if it's an object, we have a range
        return {
          startDate: Date.parse(dateObj.from),
          endDate: Date.parse(dateObj.to),
        };
      } else {
        // if it's a string, a single day is selected -> both values are the same
        // if it's null, nothing is selected -> from 0 to current day
        return {
          startDate: Date.parse(dateObj ?? '0'),
          endDate: dateObj ? Date.parse(dateObj) : Date.now(),
        };
      }
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
