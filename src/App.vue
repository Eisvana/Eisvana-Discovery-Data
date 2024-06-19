<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue';
import PageFooter from './components/PageFooter.vue';
import NavBar from './components/NavBar.vue';
import router from './router';
import { useDataStore } from './stores/data';
import { storeToRefs } from 'pinia';

const dataStore = useDataStore();
const { isLoading } = storeToRefs(dataStore);

router.beforeEach(() => (isLoading.value = true));

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
      <QToolbar class="bg-primary text-white">
        <NavBar />

        <QSpace class="xs" />

        <QToolbarTitle class="text-center gt-xs">Eisvana Discovery Data</QToolbarTitle>

        <ThemeSwitch />
      </QToolbar>
      <QToolbar class="xs">
        <QToolbarTitle class="text-center">Eisvana Discovery Data</QToolbarTitle>
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
