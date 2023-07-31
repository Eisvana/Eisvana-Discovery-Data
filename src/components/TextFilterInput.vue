<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
  intersection: string;
  searchTerm: string;
  caseSensitivity: boolean;
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

    <div class="filter-adjustments">
      <select
        :value="intersection"
        class="intersection-select"
        name="intersection"
        @input="$emit('update:intersection', ($event.target as HTMLSelectElement).value)"
      >
        <option value="includes">Includes</option>
        <option value="is">Is exactly</option>
        <option value="!includes">Doesn't include</option>
        <option value="!is">Is not</option>
      </select>

      <label
        v-if="id !== 'glyphs'"
        class="switch-label"
      >
        Case Sensitive
        <input
          :value="caseSensitivity"
          type="checkbox"
          role="switch"
          class="switch"
          @change="$emit('update:caseSensitivity', ($event.target as HTMLInputElement).checked)"
        />
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
.text-input {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-basis: 30%;
}

.filter-adjustments {
  display: flex;
  flex-wrap: wrap;
  column-gap: 0.5rem;
  container-type: inline-size;

  .intersection-select {
    flex-basis: content;
    flex-grow: 1;
  }

  .switch-label {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;
    align-content: center;
    gap: 0.5rem 0.2rem;
    flex-grow: 1;
  }

  @container (width < 300px) {
    .switch-label {
      justify-content: center;
      align-items: flex-end;
      align-content: flex-start;
      flex-direction: unset;

      .switch {
        order: -1;
      }
    }
  }
}
</style>
