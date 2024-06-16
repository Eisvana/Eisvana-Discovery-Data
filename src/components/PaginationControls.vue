<script setup lang="ts">
import { rowsPerPage } from '@/variables/pagination';
import { computed, watchEffect } from 'vue';

const props = defineProps<{
  data: unknown[];
}>();

const itemsPerPage = defineModel<number>('itemsPerPage', { required: true });
const currentPage = defineModel<number>('currentPage', { required: true });

const maxPages = computed(() => Math.ceil(props.data.length / itemsPerPage.value));

watchEffect(() => {
  if (currentPage.value > maxPages.value) currentPage.value = 1;
});
</script>

<template>
  <div class="row q-gutter-x-md">
    <QSelect
      v-model="itemsPerPage"
      :options="rowsPerPage"
      label="Results per Page"
      class="select-min-width"
    />
    <QPagination
      v-model="currentPage"
      :max="maxPages"
      input
    />
  </div>
</template>
