<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import PageFooter from '@/components/PageFooter.vue';
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Eisvana Discovery Data</h1>
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
