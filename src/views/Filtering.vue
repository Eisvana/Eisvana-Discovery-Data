<script setup lang="ts">
import { useRoute } from 'vue-router';
import FilterInputs from '../components/filter/FilterInputs.vue';
import ResultsCounter from '../components/ResultsCounter.vue';
import { toRefs } from 'vue';

const route = useRoute();
const { name: tab } = toRefs(route);
</script>

<template>
  <FilterInputs />
  <ResultsCounter />
  <nav>
    <QTabs class="subpage-nav">
      <QRouteTab
        class="link-colour"
        name="table"
        to="/"
        exact
        >Table</QRouteTab
      >
      <QRouteTab
        class="link-colour"
        name="stats"
        to="/stats"
        exact
        >Stats</QRouteTab
      >
      <QRouteTab
        class="link-colour"
        name="charts"
        to="/charts"
        exact
        >Charts</QRouteTab
      >
    </QTabs>
  </nav>

  <QSeparator />

  <QTabPanels
    v-model="tab"
    animated
  >
    <QTabPanel name="table">
      <RouterView />
    </QTabPanel>

    <QTabPanel name="stats">
      <RouterView />
    </QTabPanel>

    <QTabPanel name="charts">
      <RouterView />
    </QTabPanel>
  </QTabPanels>
</template>
