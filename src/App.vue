<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import FilterInputs from './components/FilterInputs.vue';
import ResultsCounter from './components/ResultsCounter.vue';
import { RouterView, RouterLink } from 'vue-router';
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Hub Discovery Data</h1>
  </header>

  <main>
    <FilterInputs />
    <ResultsCounter />
    <nav class="subpage-nav">
      <RouterLink to="/">Table</RouterLink>
      <RouterLink to="stats">Stats</RouterLink>
    </nav>
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}

.subpage-nav {
  justify-content: center;
  gap: 2rem;
  font-size: larger;
  margin-block-end: 1rem;
  flex-wrap: wrap;

  a.router-link-exact-active {
    color: inherit;
    pointer-events: none;
  }

}
</style>
