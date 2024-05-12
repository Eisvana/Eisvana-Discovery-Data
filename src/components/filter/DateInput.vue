<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
}>();

const model = defineModel({ type: String });
</script>

<template>
  <label :for="id">
    {{ label }}
    <input
      v-model="model"
      :id
      type="date"
    />
  </label>
</template>
