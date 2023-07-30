<script setup lang="ts">
import Switch from './Switch.vue';

defineProps<{
  label: string;
  id: string;
  switches: {
    ST: string;
    PS: string;
    XB: string;
    GX: string;
    SI: string;
  };
}>();
</script>

<template>
  <div>
    {{ label }}
    <Switch
      v-for="(value, key) in switches"
      :id="key"
      :label="value"
    />
  </div>
</template>
