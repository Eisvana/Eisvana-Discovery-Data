<script setup lang="ts">
import { useRoute } from 'vue-router';
import ThemeSwitch from './ThemeSwitch.vue';
import { computed } from 'vue';

const route = useRoute();
const glyphs = computed(() => route.params.glyphs);
const isPlanet = computed(() => route.name?.toString().includes('planetOverview'));
</script>

<template>
  <nav aria-label="Main navigation">
    <ul>
      <li v-if="!glyphs"><a href="/">&larr; View other pages</a></li>
      <li v-else>
        <nav aria-label="breadcrumb">
          <ul>
            <li><RouterLink to="/">Table</RouterLink></li>
            <template v-if="isPlanet">
              <li><RouterLink :to="`/system/${glyphs}`">System</RouterLink></li>
              <li>Planet</li>
            </template>
            <li v-else>System</li>
          </ul>
        </nav>
      </li>
    </ul>
    <ul>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>
