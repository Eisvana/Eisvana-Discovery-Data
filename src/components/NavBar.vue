<script setup lang="ts">
import { computed } from 'vue';
import ThemeSwitch from './ThemeSwitch.vue';

const GHubHosts = ['data.nmsgalactichub.com', 'discovery.nmsgalactichub.com'];

const link = computed(() =>
  GHubHosts.includes(window.location.host) ? 'https://lenni009.github.io/' /* 'https://nmsgalactichub.com' */ : '..'
);
</script>

<template>
  <nav>
    <ul>
      <li><a :href="link">&larr; View other pages</a></li>
    </ul>
    <ul>
      <li>
        <ThemeSwitch />
      </li>
    </ul>
  </nav>
</template>
