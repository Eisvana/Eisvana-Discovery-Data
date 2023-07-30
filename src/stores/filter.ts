import { defineStore } from 'pinia';

interface State {
  galaxy: string[];
}

export const useFilterStore = defineStore('filter', {
  state: (): State => ({
    galaxy: [],
  }),

  getters: {

  },

  actions: {

  }
});
