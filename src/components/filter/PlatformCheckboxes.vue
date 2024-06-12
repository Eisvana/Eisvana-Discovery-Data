<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
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
const { platforms } = storeToRefs(filterStore);
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
