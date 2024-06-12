<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
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

const allPlatforms = Object.keys(props.switches);
const enableAll = () => (platforms.value = allPlatforms);

enableAll();

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
    <div class="column">
      <QToggle
        v-for="(value, key) in switches"
        v-model="platforms"
        :label="value"
        :val="key"
      />
    </div>
  </div>
</template>
