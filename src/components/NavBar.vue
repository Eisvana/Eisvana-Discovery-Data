<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const glyphs = computed(() => route.params.glyphs);
const isPlanet = computed(() => route.name?.toString() === 'planetOverview');

const eisvanaHosts = ['atlas.eisvana.com', 'data.eisvana.com'];
const isEisvanaHost = eisvanaHosts.includes(window.location.host);
</script>

<template>
  <nav>
    <QItem
      v-if="!glyphs"
      :href="isEisvanaHost ? 'https://eisvana.com' : '/'"
    >
      <QItemSection>
        <QIcon name="arrow_back" />
      </QItemSection>
      <QItemSection avatar>View other pages</QItemSection>
    </QItem>
    <QItem v-else>
      <QBreadcrumbs
        active-color="white"
        class="breadcrumbs-wrapper"
        separator=">"
      >
        <QBreadcrumbsEl
          class="link"
          label="Table"
          to="/"
          exact
        />
        <QBreadcrumbsEl
          v-if="isPlanet"
          :to="`/system/${glyphs}`"
          class="link"
          label="System"
          exact
        />

        <QBreadcrumbsEl
          :label="isPlanet ? 'Planet' : 'System'"
          class="text-grey-4"
        />
      </QBreadcrumbs>
    </QItem>
  </nav>
</template>

<style scoped lang="scss">
.link {
  text-decoration: underline;
}

.breadcrumbs-wrapper {
  align-self: center;
}
</style>
