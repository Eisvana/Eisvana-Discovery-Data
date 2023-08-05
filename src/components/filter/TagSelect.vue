<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  options: {
    '': string;
    true: string;
    false: string;
  };
  modelValue: '' | boolean;
}>();

function getTagStatus(event: Event) {
  const selection = (event.target as HTMLSelectElement).value;
  return selection === '' ? '' : selection === 'true';
}
</script>

<template>
  <label>
    {{ label }}
    <select
      :id="id"
      :name="id"
      :value="modelValue"
      @change="$emit('update:modelValue', getTagStatus($event))"
    >
      <option
        v-for="(value, key) in options"
        :value="key"
      >
        {{ value }}
      </option>
    </select>
  </label>
</template>
