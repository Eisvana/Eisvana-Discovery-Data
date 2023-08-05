<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import Switch from '../Switch.vue';
import { storeToRefs } from 'pinia';

defineProps<{
  label: string;
  id: string;
  switches: {
    ST: string;
    PS: string;
    XB: string;
    GX: string;
    NI: string;
  };
}>();

const filterStore = useFilterStore();
const { platform } = storeToRefs(filterStore);

function togglePlatform(currentPlatform: 'ST' | 'PS' | 'XB' | 'GX' | 'NI') {
  const index = platform.value.findIndex((item) => item === currentPlatform);
  if (index === -1) {
    platform.value.push(currentPlatform);
  } else {
    platform.value.splice(index, 1);
  }
}
</script>

<template>
  <div>
    {{ label }}
    <Switch
      v-for="(value, key) in switches"
      :id="key"
      :label="value"
      @change="togglePlatform(key)"
    />
  </div>
</template>
