<script setup lang="ts">
interface Props {
  condition?: boolean;
}

withDefaults(defineProps<Props>(), {
  condition: true,
});
</script>

<template>
  <div class="transition-container">
    <Transition>
      <slot v-if="condition"></slot>
      <slot
        v-else
        name="else"
      ></slot>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.transition-container {
  display: grid;

  & > * {
    grid-area: 1 / 1;
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
