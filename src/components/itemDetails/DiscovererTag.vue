<script setup lang="ts">
import type { Platform } from '@/types/platform';
import { getPlatform } from '@/helpers/platform';
import { platformIcons } from '@/variables/platforms';
import GameIcon from '../GameIcon.vue';

defineProps<{
  name: string;
  platform: Platform;
}>();
</script>

<template>
  <div class="discoverer-name-platform">
    <span>{{ name }}</span>
    <GameIcon
      :alt="`${getPlatform(platform)} Icon`"
      :no-theming="platform === 'PS'"
      :src="platformIcons[platform]"
      :title="getPlatform(platform)"
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
</style>
