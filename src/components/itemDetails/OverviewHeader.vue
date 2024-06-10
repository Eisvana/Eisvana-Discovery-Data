<script setup lang="ts">
import { getFormattedUTCDateString } from '@/helpers/date';
import type { DiscoveryData } from '@/types/data';
import DiscovererTag from './DiscovererTag.vue';

defineProps<{
  itemData: DiscoveryData;
}>();
</script>

<template>
  <div class="discovery-header">
    <div>
      <h2
        :class="itemData.Name ? 'text-bold' : 'text-italic'"
        class="q-ma-none"
      >
        {{ itemData.Name || 'Unknown' }}
      </h2>

      <div class="glyphs">{{ itemData.Glyphs }}</div>
    </div>
    <div class="text-right">
      <DiscovererTag
        :name="itemData.Discoverer"
        :platform="itemData.Platform"
      />
      <div>{{ getFormattedUTCDateString(itemData.Timestamp) }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.discovery-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-block-end: 0.75rem;
}
</style>
