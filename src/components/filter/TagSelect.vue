<script setup lang="ts">
defineProps<{
  label: string;
  options: {
    label: string;
    value: string;
  }[];
}>();

const model = defineModel();
</script>

<template>
  <QSelect
    v-model="model"
    :label
    :options
  />
</template>
