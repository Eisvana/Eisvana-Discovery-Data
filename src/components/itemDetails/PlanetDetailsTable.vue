<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import type { DiscoveryData } from '@/types/data';

interface Props {
  itemType: string;
  planetDetails?: DiscoveryData[];
  headings?: string[];
}

withDefaults(defineProps<Props>(), {
  headings: () => ['Name', 'Discoverer', 'Platform', 'Timestamp'],
  planetDetails: () => [],
});
</script>

<template>
  <QCard
    :class="{ 'shadow-1': planetDetails.length }"
    :flat="!planetDetails.length"
    bordered
  >
    <QExpansionItem
      :disable="!planetDetails.length"
      :label="`${itemType} (${planetDetails.length})`"
    >
      <QMarkupTable
        class="text-left"
        flat
      >
        <thead class="table-header">
          <tr>
            <th
              v-for="heading in headings"
              scope="col"
            >
              {{ heading }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in planetDetails">
            <td :class="{ 'text-italic': !item.Name }">{{ item.Name || 'unknown (procedural name)' }}</td>
            <td>{{ item.Discoverer }}</td>
            <td>{{ getPlatform(item.Platform) }}</td>
            <td v-if="item.Gamemode">{{ item.Gamemode }}</td>
            <td v-if="item.Parts">{{ item.Parts }}</td>
            <td>{{ getFormattedUTCDateString(item.Timestamp) }}</td>
          </tr>
        </tbody>
      </QMarkupTable>
    </QExpansionItem>
  </QCard>
</template>
