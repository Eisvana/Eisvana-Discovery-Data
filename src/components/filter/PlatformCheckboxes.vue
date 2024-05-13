<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import Switch from '../Switch.vue';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import type { Platform } from '@/types/platform';

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

enableAll();

function enableAll() {
  for (const platformCode in props.switches) {
    platforms.value[platformCode] ||= true;
  }
}

// setTimeout so that this code is executed after the reset action (setTimeout pushes its content to the end of the callstack)
function resetFunc() {
  setTimeout(() => {
    enableAll();
  }, 0);
}

onMounted(() => document.addEventListener('reset', resetFunc));
onUnmounted(() => document.removeEventListener('reset', resetFunc));

function togglePlatform(e: Event, key: Platform) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement)) return;
  platforms.value[key] = target.checked;
}
</script>

<template>
  <div>
    {{ label }}
    <Switch
      v-for="(value, key) in switches"
      :checked="platforms[key]"
      :id="key"
      :label="value"
      @change="(e: Event) => togglePlatform(e, key)"
    />
  </div>
</template>
