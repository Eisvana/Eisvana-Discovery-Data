<script setup lang="ts">
import Toolbar from './components/Toolbar.vue';
import PageFooter from '@/components/PageFooter.vue';
</script>

<template>
  <header>
    <Toolbar />
  </header>

  <RouterView />

  <PageFooter />
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}

</style>
