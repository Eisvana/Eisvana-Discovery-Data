<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const filterStore = useFilterStore();
const { data: filteredData } = storeToRefs(filterStore);

interface TextArray {
  text: string;
  className: string;
}

function getFullPlatform(platform: string) {
  const platformMapping: {
    ST: string;
    PS: string;
    XB: string;
    GX: string;
    NI: string;
    [key: string]: string;
  } = {
    ST: 'Steam',
    PS: 'PlayStation',
    XB: 'Xbox',
    GX: 'GOG',
    NI: 'Nintendo Switch',
  };
  return platformMapping[platform];
}

const dataArray = computed(() => {
  const textArray: TextArray[] = [];
  for (const data of filteredData.value) {
    for (const [key, value] of Object.entries(data)) {
      if (key === 'UnixTimestamp') continue;
      let text: string = '';
      let className: string = '';
      if (key === 'Platform') {
        text = getFullPlatform(value as string);
      } else {
        text = value.toString(); // NoSonar this won't be [object Object]
        if (key === 'Glyphs') className = 'glyphs';
      }
      const newObj = {
        text,
        className,
      };
      textArray.push(newObj);
    }
    if (textArray.length === 60) break;
  }
  return textArray;
});
</script>

<template>
  <div class="data-table">
    <div
      v-for="text in dataArray"
      :class="text.className"
    >
      {{ text.text }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.data-table {
  display: grid;
  grid-template-columns: repeat(6, auto);
  column-gap: 0.5rem;
  align-items: center;
}
</style>
