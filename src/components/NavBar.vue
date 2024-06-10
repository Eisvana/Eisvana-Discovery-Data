<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const glyphs = computed(() => route.params.glyphs);
const isPlanet = computed(() => route.name?.toString() === 'planetOverview');
</script>

<template>
  <nav aria-label="Main navigation">
    <a
      v-if="!glyphs"
      href="/"
      >&larr; View other pages</a
    >
    <QBreadcrumbs
      v-else
      separator=">"
    >
      <QBreadcrumbsEl> <RouterLink to="/">Table</RouterLink></QBreadcrumbsEl>
      <template v-if="isPlanet">
        <QBreadcrumbsEl><RouterLink :to="`/system/${glyphs}`">System</RouterLink></QBreadcrumbsEl>
        <QBreadcrumbsEl>Planet</QBreadcrumbsEl>
      </template>
      <QBreadcrumbsEl v-else>System</QBreadcrumbsEl>
    </QBreadcrumbs>
  </nav>
</template>

<style scoped lang="scss">
.breadcrumb-nav li {
  padding-block: 0;
}
</style>
