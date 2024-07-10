<script setup lang="ts">
interface Props {
  label?: string;
  showing?: boolean;
}

withDefaults(defineProps<Props>(), {
  label: 'Loading Data...',
  showing: true,
});
</script>

<template>
  <QInnerLoading
    :label
    :showing
  />
</template>
