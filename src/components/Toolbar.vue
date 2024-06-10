<script setup lang="ts">
import { ref } from 'vue';
import ThemeSwitch from './ThemeSwitch.vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => (leftDrawerOpen.value = !leftDrawerOpen.value);
</script>

<template>
  <QToolbar class="bg-primary text-white">
    <QBtn
      class="q-mr-sm"
      icon="menu"
      dense
      flat
      round
      @click="toggleLeftDrawer"
    />

    <QToolbarTitle class="title">Eisvana Discovery Data</QToolbarTitle>

    <ThemeSwitch />
  </QToolbar>
</template>

<style scoped lang="scss">
.title {
  text-align: center;
}
</style>
