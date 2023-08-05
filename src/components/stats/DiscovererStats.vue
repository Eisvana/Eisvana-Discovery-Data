<script setup lang="ts">
import { paginateData } from '@/logic/logic';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';
import PaginationControls from '../table/PaginationControls.vue';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged, itemsPerPage, currentPageIndex } = storeToRefs(dataStore);

const getPercentage = (amount: number, total: number) => parseFloat(((amount / total) * 100).toFixed(1)); // NoSonar this calculates a percentage

enum Orders {
  asc = 'ascending',
  desc = 'descending',
}

const sorting = reactive<{ col: number; order: Orders }>({
  col: 1,
  order: Orders.desc,
});

const discovererStats = computed(() => {
  interface DiscovererData {
    [key: string]: {
      discoveries: number;
      discPercent: string;
      tagged: number;
      taggedPercent: string;
      taggedPercentSelf: string;
    };
  }

  const discovererData: DiscovererData = {};

  for (const data of filteredData.value) {
    if (!data.Discoverer) continue;
    const discovererObject = (discovererData[data.Discoverer] ??= {
      discoveries: 0,
      discPercent: '0%',
      tagged: 0,
      taggedPercent: '0%',
      taggedPercentSelf: '0%',
    });
    discovererObject.discoveries++;
    if (data['Correctly Tagged']) discovererObject.tagged++;
    discovererObject.discPercent = getPercentage(discovererObject.discoveries, dataLength.value) + '%';
    discovererObject.taggedPercent = getPercentage(discovererObject.tagged, amountTagged.value) + '%';
    discovererObject.taggedPercentSelf = getPercentage(discovererObject.tagged, discovererObject.discoveries) + '%';
  }

  const dataArray: (string | number)[][] = [];

  for (const [discoverer, stats] of Object.entries(discovererData)) {
    dataArray.push([discoverer, ...Object.values(stats)]);
  }

  return dataArray;
});

const discovererDataSorted = computed(() => {
  // I'd love to use .toSorted() here, but it seems like it doesn't work and instead just uses .sort()
  const sortedArray = structuredClone(discovererStats.value).sort((a, b) => {
    const aValue = a[sorting.col];
    const bValue = b[sorting.col];
    const aNum = typeof aValue === 'string' ? parseFloat(aValue) : aValue;
    const bNum = typeof bValue === 'string' ? parseFloat(bValue) : bValue;

    return isNaN(aNum) || isNaN(bNum) ? (bValue < aValue ? 1 : -1) : bNum - aNum;
  });

  for (let i = 0; i < sortedArray.length; i++) {
    sortedArray[i].unshift(`${i + 1}.`);
  }

  if (sorting.order === Orders.asc) sortedArray.reverse();

  return sortedArray;
});

const toggleSortingOrder = () => (sorting.order = sorting.order === Orders.asc ? Orders.desc : Orders.asc);

function sort(event: Event) {
  const element = event.target as HTMLDivElement;
  const parent = element.parentElement!;
  const index = Array.from(parent.children).indexOf(element) - 1;
  if (sorting.col === index) {
    toggleSortingOrder();
  } else {
    sorting.col = index;
    sorting.order = Orders.desc;
    parent.querySelector('[aria-sort]')?.removeAttribute('aria-sort');
  }
  element.setAttribute('aria-sort', sorting.order);
}

const paginatedData = computed(() => {
  const pages = paginateData(discovererDataSorted.value, itemsPerPage.value.discovererStats);

  if (pages.length < currentPageIndex.value.discovererStats) currentPageIndex.value.discovererStats = 0;
  return pages;
});

const useableData = computed(() => paginatedData.value[currentPageIndex.value.discovererStats]?.flat() ?? []);
</script>

<template>
  <div v-if="useableData.length">
    Discoverer Stats
    <PaginationControls
      :total-items="discovererDataSorted.length"
      section="discovererStats"
    />
    <div class="stat-grid">
      <div
        class="table-header"
        data-sort="false"
      >
        Pos.
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Name
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Discoveries
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Discoveries %
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Tagged
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Tagged %<br />of total
      </div>
      <div
        class="table-header"
        @click="sort"
      >
        Tag Rate
      </div>
      <div v-for="data in useableData">
        {{ data }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(7, auto);
}

.table-header:not([data-sort='false']) {
  cursor: pointer;

  &:after {
    content: '';
    float: right;
    margin-block-start: 0.5rem;
    margin-inline-start: 0.15rem;
    border-width: 4px 4px 0;
    border-style: solid;
    border-color: var(--color) transparent;
    visibility: hidden;
    user-select: none;
  }

  &[aria-sort='ascending']:after {
    border-top: none;
    border-width: 0 4px 4px;
  }

  &[aria-sort]:after {
    visibility: visible;
    opacity: 0.6;
  }

  &:hover:after {
    visibility: visible;
    opacity: 1;
  }
}
</style>
