<script setup lang="ts">
import { useRoute } from 'vue-router';
import ThemeSwitch from './ThemeSwitch.vue';
import { computed } from 'vue';

const route = useRoute();
const glyphs = computed(() => route.params.glyphs);
const isPlanet = computed(() => route.name?.toString() === 'planetOverview');
</script>

<template>
  <nav aria-label="Main navigation">
    <ul>
      <li v-if="!glyphs"><a href="/">&larr; View other pages</a></li>
      <li v-else>
        <QBreadcrumbs separator=">">
          <QBreadcrumbsEl> <RouterLink to="/">Table</RouterLink></QBreadcrumbsEl>
          <template v-if="isPlanet">
            <QBreadcrumbsEl><RouterLink :to="`/system/${glyphs}`">System</RouterLink></QBreadcrumbsEl>
            <QBreadcrumbsEl>Planet</QBreadcrumbsEl>
          </template>
          <QBreadcrumbsEl v-else>System</QBreadcrumbsEl>
        </QBreadcrumbs>
      </li>
    </ul>
    <ul>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.breadcrumb-nav li {
  padding-block: 0;
}
</style>
