<script setup lang="ts">
import { Dark } from 'quasar';

function switchTheme() {
  const currentMode = Dark.mode; // "auto", true, false
  Dark.set(!currentMode); // or false or "auto"
}
</script>

<template>
  <button
    class="themeswitcher"
    id="themeSwitch"
    @click="switchTheme"
  >
    Switch Theme
  </button>
</template>
