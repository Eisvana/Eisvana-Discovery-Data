<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  options: {
    '': string;
    true: string;
    false: string;
  };
}>();

const model = defineModel();
</script>

<template>
  <label>
    {{ label }}
    <select
      v-model="model"
      :id="id"
      :name="id"
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
