<script setup lang="ts">
defineProps<{
  src: string;
  alt?: string;
  title?: string;
  noTheming?: boolean;
}>();
</script>

<template>
  <img
    :alt
    :src
    :title
  />
</template>

<style scoped lang="scss">
body.body--light img {
  filter: invert(100);
}
</style>
