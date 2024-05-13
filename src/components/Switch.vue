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
      :aria-checked="Boolean(checked)"
      :checked="Boolean(checked)"
      :id="id"
      :name="id"
      role="switch"
      type="checkbox"
    />
    {{ label }}
  </label>
</template>
