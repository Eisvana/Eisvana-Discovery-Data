<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  checked: boolean | undefined;
}>();
</script>

<template>
  <label :for="id">
    <input
      type="checkbox"
      :checked="Boolean(checked)"
      :id="id"
      :name="id"
      role="switch"
    />
    {{ label }}
  </label>
</template>
