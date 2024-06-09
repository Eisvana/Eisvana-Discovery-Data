<script setup lang="ts">
import ThemeSwitch from './ThemeSwitch.vue';
</script>

<template>
  <QToolbar class="bg-primary text-white">
    <QBtn
      class="q-mr-sm"
      icon="menu"
      dense
      flat
      round
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
