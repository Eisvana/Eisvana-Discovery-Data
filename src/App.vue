<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import FilterInputs from './components/FilterInputs.vue';
import ResultsCounter from './components/ResultsCounter.vue';
import ResultsTable from './components/ResultsTable.vue';
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Hub Discovery Data</h1>
  </header>

  <main>
    <FilterInputs />
    <ResultsCounter />
    <ResultsTable />
  </main>
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}
</style>
