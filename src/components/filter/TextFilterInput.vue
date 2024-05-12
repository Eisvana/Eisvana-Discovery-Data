<script setup lang="ts">
defineProps<{
  label: string;
  id: string;
}>();

const searchTerm = defineModel('searchTerm', { type: String });
const intersection = defineModel('intersection', { type: String });
const caseSensitivity = defineModel('caseSensitivity', { type: Boolean });
</script>

<template>
  <div class="text-input">
    <label :for="id">
      {{ label }}
      <input
        v-model="searchTerm"
        :id="id"
        :name="id"
        type="text"
      />
    </label>

    <div class="filter-adjustments">
      <select
        v-model="intersection"
        class="intersection-select"
        name="intersection"
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
          v-model="caseSensitivity"
          :aria-checked="caseSensitivity"
          class="switch"
          role="switch"
          type="checkbox"
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
