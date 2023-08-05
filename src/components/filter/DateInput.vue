<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  modelValue: string;
}>();
</script>

<template>
  <label :for="id">
    {{ label }}
    <input
      :id="id"
      type="date"
      :value="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
