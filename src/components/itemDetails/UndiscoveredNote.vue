<script setup lang="ts">
defineProps<{
  type: string;
}>();
</script>

<template>
  <p class="text-h4">This {{ type }} has not been discovered yet!</p>
</template>
