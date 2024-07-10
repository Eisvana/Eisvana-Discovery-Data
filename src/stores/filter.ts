import { defineStore } from 'pinia';
import type { DateRangeObj, UnixTimestamp } from '@/types/date';
import { regions as allEisvanaRegions } from '@/variables/regions';
import { availableCategories } from '@/variables/categories';
import { invertSwitches } from '@/helpers/filter';
import { categoryMapping } from '@/variables/mappings';
import { is } from 'quasar';
import type { DiscoveryCategories } from '@/types/data';
import { isValidCategory } from '@/helpers/categories';
import { platformCodes } from '@/variables/platforms';
import { toRaw } from 'vue';

interface TextSearch<T> {
  name: T;
  glyphs: T;
  discoverer: T;
  [key: string]: T;
}

interface State {
  regions: string[];
  categories: DiscoveryCategories[];
  searchTerms: TextSearch<string>;
  intersections: TextSearch<'includes' | 'is' | '!includes' | '!is'>;
  caseSensitivity: TextSearch<boolean>;
  platforms: string[];
  date: DateRangeObj;
  tagged: '' | boolean;
  procName: '' | boolean;
}

interface StateWithActiveFilter extends State {
  activeFilterSettings: State;
}

const rawFilterState: State = {
  regions: Object.values(allEisvanaRegions),
  categories: ['SolarSystem'],
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

  platforms: platformCodes,
  date: null,
  tagged: '',
  procName: '',
};

const defaultFilterState: StateWithActiveFilter = {
  ...rawFilterState,
  activeFilterSettings: structuredClone(rawFilterState),
};

export const useFilterStore = defineStore('filter', {
  state: (): StateWithActiveFilter => structuredClone(defaultFilterState),

  getters: {
    unixTimestamp: (state): UnixTimestamp => {
      const dateObj = state.date;

      if (is.object(dateObj)) {
        // if it's an object, we have a range
        return {
          startDate: new Date(dateObj.from).getTime(),
          endDate: new Date(dateObj.to).getTime(),
        };
      } else {
        // if it's a string, a single day is selected -> both values are the same
        // if it's null, nothing is selected -> from 0 to current day
        return {
          startDate: new Date(dateObj ?? '0').getTime(),
          endDate: dateObj ? new Date(dateObj).getTime() : Date.now(),
        };
      }
    },

    sortedPlatforms: (state) => platformCodes.filter((item) => state.activeFilterSettings.platforms.includes(item)),
    sortedCategories: (state) =>
      availableCategories.filter((item) => state.activeFilterSettings.categories.includes(item)),
    sortedRegions: (state) =>
      Object.values(allEisvanaRegions).filter((item) => state.activeFilterSettings.regions.includes(item)),
  },

  actions: {
    invertRegionSwitches() {
      this.regions = invertSwitches(this.regions, Object.values(allEisvanaRegions));
    },

    invertCategorySwitches() {
      this.categories = invertSwitches(this.categories, Object.keys(categoryMapping).filter(isValidCategory));
    },

    applyFilter() {
      // this extracts the activeFilterSettings property into its own variable, while combining all other properties into a new object
      const { activeFilterSettings, ...currentFilterCopy } = this.$state;

      // nested objects are proxies and need to be converted to raw objects first
      const currentFilterEntries = Object.entries(currentFilterCopy).map((item) => [item[0], toRaw(item[1])]);

      this.activeFilterSettings = Object.fromEntries(structuredClone(currentFilterEntries));
    },

    resetStore() {
      this.$patch(structuredClone(defaultFilterState));
    },
  },
});

export type { State as FilterStoreState };
