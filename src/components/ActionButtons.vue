<script setup lang="ts">
import type { GlobalCustomEvents } from '@/types/events';

function dispatchGlobalCustomEvent(eventName: GlobalCustomEvents) {
  const event = new Event(eventName);
  document.dispatchEvent(event);
}

const loadData = () => dispatchGlobalCustomEvent('filter');
const resetFilter = () => dispatchGlobalCustomEvent('reset');
</script>

<template>
  <div class="button-wrapper q-mt-sm">
    <QBtn
      class="col-grow"
      color="primary"
      label="Apply Filter"
      @click="loadData"
    />
    <QBtn
      class="col-grow"
      label="Reset Filter"
      type="reset"
      outline
      @click="resetFilter"
    />
  </div>
</template>

<style scoped lang="scss">
.button-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
}
</style>
