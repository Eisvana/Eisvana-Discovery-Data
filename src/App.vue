<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import FilterInputs from './components/filter/FilterInputs.vue';
import ResultsCounter from './components/ResultsCounter.vue';
import { RouterView, RouterLink } from 'vue-router';
import PageFooter from '@/components/PageFooter.vue';
</script>

<template>
  <header>
    <NavBar />
    <h1 class="title">Eisvana Discovery Data</h1>
  </header>

  <main>
    <FilterInputs />
    <ResultsCounter />
    <nav class="subpage-nav">
      <ul>
        <li><RouterLink to="/">Table</RouterLink></li>
        <li><RouterLink to="stats">Stats</RouterLink></li>
        <li><RouterLink to="charts">Charts</RouterLink></li>
      </ul>
    </nav>
    <hr />
    <RouterView />
  </main>
  <PageFooter />
</template>

<style scoped lang="scss">
.title {
  margin-block-end: 2rem;
  text-align: center;
}

.subpage-nav ul {
  justify-content: center;
  gap: 2rem;
  font-size: larger;
  flex-wrap: wrap;
  margin-inline: auto;

  li,
  a {
    padding: 0;
    margin: 0;
  }

  a.router-link-exact-active {
    color: inherit;
    pointer-events: none;
  }
}
</style>
