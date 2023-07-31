<script setup lang="ts">
import { useFilterStore } from '@/stores/filter';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const filterStore = useFilterStore();
const { filteredData } = storeToRefs(filterStore);

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
      if (key === 'Timestamp') continue;

      let text: string = '';
      let className: string = '';

      switch (key) {
        case 'Name':
          text = (value as string) || 'Unknown (procedural name)';
          if (!value) className = 'italic';
          break;

        case 'Platform':
          text = getFullPlatform(value as string);
          break;

        case 'UnixTimestamp':
          text = new Date(value as number).toLocaleDateString();
          break;

        case 'Correctly Tagged':
          text = (value as boolean).toString().charAt(0).toUpperCase() + (value as boolean).toString().slice(1);
          break;

        default:
          text = value.toString(); // NoSonar this won't be [object Object]
          if (key === 'Glyphs') className = 'glyphs';
          break;
      }

      const newObj = {
        text,
        className,
      };

      textArray.push(newObj);
    }
  }
  return textArray;
});
</script>

<template>
  <div
    v-if="dataArray.length"
    class="data-table"
  >
    <div class="header">System Name</div>
    <div class="header">Glyphs</div>
    <div class="header">Discoverer</div>
    <div class="header">Platform</div>
    <div class="header">Date</div>
    <div class="header">Tagged</div>
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

  .header {
    font-weight: bold;
    border-block-end: 1px solid var(--color);
    padding-block-end: 0.25rem;
    padding-block-start: 0.5rem;
    position: sticky;
    top: 0;
    background-color: var(--background-color);
  }

  .italic {
    font-style: italic;
  }
}
</style>
