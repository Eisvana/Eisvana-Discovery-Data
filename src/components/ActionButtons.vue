<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';

const filterStore = useFilterStore();

const resetStore = () => filterStore.$reset();
</script>

<template>
  <div class="actions">
    <input
      role="button"
      type="submit"
      value="Apply Filter"
    />

    <input
      role="button"
      type="reset"
      value="Reset Filter"
      @click="resetStore"
    />
  </div>
</template>

<style scoped lang="scss">
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  input {
    flex-basis: content;
    flex-grow: 1;
  }
}
</style>
