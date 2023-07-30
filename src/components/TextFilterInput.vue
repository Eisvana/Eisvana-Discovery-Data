<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
}>();
</script>

<template>
  <div class="text-input">
    <label :for="id">
      {{ label }}
      <input
        :id="id"
        :name="id"
        type="text"
      />
    </label>

    <select name="intersection">
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
