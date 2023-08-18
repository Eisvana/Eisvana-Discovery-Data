<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import Switch from '../Switch.vue';
import { storeToRefs } from 'pinia';

const props = defineProps<{
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
const { platforms } = storeToRefs(filterStore);

for (const short in props.switches) {
  platforms.value[short] = true;
}
</script>

<template>
  <div>
    {{ label }}
    <Switch
      v-for="(value, key) in switches"
      :id="key"
      :label="value"
      :checked="platforms[key]"
      @change="(e: Event) => (platforms[key] = (e.target as HTMLInputElement).checked)"
    />
  </div>
</template>
