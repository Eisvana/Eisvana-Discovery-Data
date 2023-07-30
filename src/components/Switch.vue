<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
}>();
</script>

<template>
  <label :for="id">
    <input
      type="checkbox"
      :id="id"
      :name="id"
      role="switch"
    />
    {{ label }}
  </label>
</template>
