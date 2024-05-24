<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import { getPlatform } from '@/helpers/platform';
import type { DiscoveryData } from '@/types/data';

defineProps<{
  planetData: DiscoveryData;
}>();
</script>

<template>
  <article>
    <header :class="planetData.Name ? 'text-bold' : 'italic'">
      {{ planetData.Name || 'Unknown' }}
    </header>
    <div class="stat-grid">
      <div>Discoverer: {{ planetData.Discoverer }}</div>
      <div>Platform: {{ getPlatform(planetData.Platform) }}</div>
      <div>
        Glyphs: <span class="glyphs">{{ planetData.Glyphs }}</span>
      </div>
      <div>Date: {{ getFormattedUTCDateString(planetData.Timestamp) }}</div>
      <div>Fauna: {{ planetData.Fauna }}</div>
      <div>Flora: {{ planetData.Flora }}</div>
      <div>Minerals: {{ planetData.Minerals }}</div>
      <div>Settlements: {{ planetData.Settlements }}</div>
      <div>Bases: {{ planetData.Bases }}</div>
    </div>
    <footer>
      <RouterLink :to="`/system/${planetData.Glyphs}`">View More</RouterLink>
    </footer>
  </article>
</template>
