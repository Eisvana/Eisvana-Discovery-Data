<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
}>();
</script>

<template>
  <label :for="id">
    {{ label }}
    <input
      :id="id"
      type="date"
    />
  </label>
</template>
