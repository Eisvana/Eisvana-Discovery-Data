<script setup lang="ts">
import { PlatformMapping } from '@/objects/mappings';
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged, itemsPerPage, currentPageIndex } = storeToRefs(dataStore);

const getPercentage = (amount: number, total: number) => parseFloat(((amount / total) * 100).toFixed(1)); // NoSonar this calculates a percentage

enum Orders {
  asc = 'ascending',
  desc = 'descending',
}

const sorting = reactive<{ col: number; order: Orders }>({
  col: 2,
  order: Orders.desc,
});

const platformStats = computed(() => {
  interface PlatformData {
    [key: string]: {
      players: number;
      discoveries: number;
      discPercent: string;
      tagged: number;
      taggedPercent: string;
      taggedPercentSelf: string;
    };
  }

  interface PlayerData {
    Steam: Set<string>;
    PlayStation: Set<string>;
    Xbox: Set<string>;
    GOG: Set<string>;
    'Nintendo Switch': Set<string>;
  }

  const playerData: PlayerData = {
    Steam: new Set(),
    PlayStation: new Set(),
    Xbox: new Set(),
    GOG: new Set(),
    'Nintendo Switch': new Set(),
  };

  const platformData: PlatformData = {};

  for (const data of filteredData.value) {
    if (!data.Platform) continue;
    const platform = PlatformMapping[data.Platform];
    const platformObject = (platformData[platform] ??= {
      players: 0,
      discoveries: 0,
      discPercent: '0%',
      tagged: 0,
      taggedPercent: '0%',
      taggedPercentSelf: '0%',
    });
    platformObject.discoveries++;
    if (data['Correctly Tagged']) platformObject.tagged++;
    playerData[platform].add(data.Discoverer);
    platformObject.players = playerData[platform].size;
    platformObject.discPercent = getPercentage(platformObject.discoveries, dataLength.value) + '%';
    platformObject.taggedPercent = getPercentage(platformObject.tagged, amountTagged.value) + '%';
    platformObject.taggedPercentSelf = getPercentage(platformObject.tagged, platformObject.discoveries) + '%';
  }

  const dataArray: (string | number)[][] = [];

  for (const [platform, stats] of Object.entries(platformData)) {
    dataArray.push([platform, ...Object.values(stats)]);
  }

  return dataArray;
});

const platformDataSorted = computed(() => {
  // I'd love to use .toSorted() here, but it seems like it doesn't work and instead just uses .sort()
  const sortedArray = structuredClone(platformStats.value).sort((a, b) => {
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

  return sortedArray.flat();
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
</script>

<template>
  <div v-if="platformDataSorted.length">
    Platform Stats
    <div class="stat-grid">
      <div
        class="table-header"
      >
        Pos.
      </div>
      <div class="table-header sortable">Platform</div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Players
      </div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Discoveries
      </div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Discoveries %
      </div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Tagged
      </div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Tagged %<br />of total
      </div>
      <div
        class="table-header sortable"
        @click="sort"
      >
        Tag Rate
      </div>
      <div v-for="data in platformDataSorted">
        {{ data }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(8, auto);
}
</style>
