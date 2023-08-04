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

  a.router-link-exact-active {
    color: var(--color-text);
    pointer-events: none;
  }

  a.router-link-exact-active:hover {
    background-color: transparent;
  }

  a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }
}
</style>
