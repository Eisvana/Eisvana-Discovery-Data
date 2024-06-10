<script setup lang="ts">
import { Dark } from 'quasar';

function switchTheme() {
  const currentMode = Dark.mode; // "auto", true, false
  Dark.set(!currentMode); // or false or "auto"
}
</script>

<template>
  <QBtn
    icon="settings_brightness"
    title="Switch Theme"
    flat
    fab
    @click="switchTheme"
  >
  </QBtn>
</template>
