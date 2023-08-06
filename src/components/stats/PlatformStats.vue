<script setup lang="ts">
import { getPercentage, sortData } from '@/logic/logic';
import { Orders, PlatformMapping } from '@/objects/mappings';
import { useDataStore } from '@/stores/data';
import type { Sorting, TableHeadings } from '@/types/data';
import { storeToRefs } from 'pinia';
import { computed, reactive } from 'vue';
import DataTable from '../table/DataTable.vue';

const dataStore = useDataStore();
const { filteredData, dataLength, amountTagged } = storeToRefs(dataStore);

const sorting = reactive<Sorting>({
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

const platformDataSorted = computed(() => sortData(platformStats.value, sorting).flat());

const headers: TableHeadings = {
  normal: ['Pos.'],
  sortable: ['Platform', 'Players', 'Discoveries', 'Discoveries %', 'Tagged', 'Tagged %\nof total', 'Tag Rate'],
};
</script>

<template>
  <details
    v-if="platformDataSorted.length"
    open
  >
    <summary>Platform Stats</summary>
    <DataTable
      :headers="headers"
      :sorting="sorting"
      :data="platformDataSorted"
    />
  </details>
</template>
