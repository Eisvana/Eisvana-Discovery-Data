import { defineStore } from 'pinia';

interface TextSearch {
  searchTerm: string;
  intersection: string;
}

interface State {
  galaxy: string[];
  name: TextSearch;
  glyphs: TextSearch;
  discoverer: TextSearch;
  platform: string[];
  date: string[];
  tagged: boolean | undefined;
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    galaxy: [],
    name: {
      searchTerm: '',
      intersection: ''
    },
    glyphs: {
      searchTerm: '',
      intersection: ''
    },
    discoverer: {
      searchTerm: '',
      intersection: ''
    },
    platform: [],
    date: [],
    tagged: undefined
  }),

  getters: {

  },

  actions: {

  }
});
