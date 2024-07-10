<script setup lang="ts">
import { onMounted, ref } from 'vue';

// This is weird. For some reason, if we don't do this, the chart just pops in after a short delay instead of animating.
// This also only affects pie charts.
const isOpen = ref(false);
onMounted(() => (isOpen.value = true));
</script>

<template>
  <div
    v-if="isOpen"
    class="pie-chart q-mx-auto"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.pie-chart {
  width: min(700px, 100%);
  margin-block-start: 2rem;
}
</style>
