<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import Switch from '../Switch.vue';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';

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
  for (const short in props.switches) {
    platforms.value[short] = true;
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
