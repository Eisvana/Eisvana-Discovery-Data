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
  <QExpansionItem
    :disable="!planetDetails.length"
    :label="`${itemType} (${planetDetails.length})`"
  >
    <table class="striped">
      <thead>
        <tr>
          <th v-for="heading in headings">{{ heading }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in planetDetails">
          <td>{{ item.Name || 'unknown' }}</td>
          <td>{{ item.Discoverer }}</td>
          <td>{{ getPlatform(item.Platform) }}</td>
          <td>{{ getFormattedUTCDateString(item.Timestamp) }}</td>
        </tr>
      </tbody>
    </table>
  </QExpansionItem>
</template>
