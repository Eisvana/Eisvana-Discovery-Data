<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  intersection: string;
  searchTerm: string;
}>();
</script>

<template>
  <div class="text-input">
    <label :for="id">
      {{ label }}
      <input
        :id="id"
        :name="id"
        :value="searchTerm"
        type="text"
        @input="$emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <select
      :value="intersection"
      name="intersection"
      @input="$emit('update:intersection', ($event.target as HTMLSelectElement).value)"
    >
      <option value="includes">Includes</option>
      <option value="is">Is exactly</option>
      <option value="!includes">Doesn't include</option>
      <option value="!is">Is not</option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.text-input {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
