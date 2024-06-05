<script setup lang="ts">
import type { Platform } from '@/types/platform';
import { getPlatform } from '@/helpers/platform';
import { platformIcons } from '@/variables/platforms';

defineProps<{
  name: string;
  platform: Platform;
}>();
</script>

<template>
  <div class="discoverer-name-platform">
    <span>{{ name }}</span>
    <img
      :alt="`${getPlatform(platform)} Icon`"
      :src="platformIcons[platform]"
      class="platform-icon"
    />
  </div>
</template>

<style scoped lang="scss">
.discoverer-name-platform {
  display: flex;
  gap: 0.25rem;

  .platform-icon {
    width: 1.55rem;
  }
}

[data-theme='light'] .platform-icon {
  filter: invert(100);
}
</style>
