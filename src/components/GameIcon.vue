<script setup lang="ts">
import { Dark } from 'quasar';
import { reactive, toRefs } from 'vue';

defineProps<{
  src: string;
  alt?: string;
  title?: string;
}>();

const reactiveDark = reactive(Dark);
const { mode } = toRefs(reactiveDark);
</script>

<template>
  <img
    :class="{ dark: !mode }"
    :alt
    :src
    :title
  />
</template>

<style scoped lang="scss">
img.dark {
  filter: invert(100);
}
</style>
