<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';

defineProps<{
  label: string;
  switches: {
    ST: string;
    PS: string;
    XB: string;
    GX: string;
    NI: string;
  };
}>();

const filterStore = useFilterStore();
const { platforms } = storeToRefs(filterStore);
</script>

<template>
  <div class="column width-content">
    {{ label }}
    <QToggle
      v-for="(value, key) in switches"
      v-model="platforms"
      :label="value"
      :val="key"
    />
  </div>
</template>

<style scoped lang="scss">
.width-content {
  width: fit-content;
}
</style>
