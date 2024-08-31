<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue';
import PageFooter from './components/PageFooter.vue';
import NavBar from './components/NavBar.vue';
import router from './router';
import { useDataStore } from './stores/data';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();

const { isLoading } = storeToRefs(dataStore);

router.beforeResolve(() => (isLoading.value = true));

router.afterEach(() => {
  const transitionDuration = 300;
  setTimeout(() => (isLoading.value = false), transitionDuration);
});
</script>

<template>
  <QLayout view="hHh LpR fff">
    <QHeader
      class="bg-primary text-white"
      elevated
    >
      <QToolbar>
        <NavBar />

        <QSpace class="xs" />

        <QToolbarTitle class="text-center gt-xs">
          <h1>Eisvana Discovery Data</h1>
        </QToolbarTitle>

        <ThemeSwitch />
      </QToolbar>
      <QToolbar class="xs q-mb-sm mobile-title-bar">
        <QToolbarTitle class="text-center">
          <h1>Eisvana Discovery Data</h1>
        </QToolbarTitle>
      </QToolbar>
    </QHeader>

    <QPageContainer>
      <QPage padding>
        <RouterView />
      </QPage>
    </QPageContainer>

    <QFooter
      class="bg-grey-8 text-white text-center"
      elevated
    >
      <PageFooter />
    </QFooter>
  </QLayout>
</template>

<style scoped lang="scss">
h1 {
  all: unset;
}

.mobile-title-bar {
  min-height: unset;
  margin-block-start: -0.5rem;
}
</style>
