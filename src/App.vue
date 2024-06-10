<script setup lang="ts">
import ThemeSwitch from './components/ThemeSwitch.vue';
import PageFooter from './components/PageFooter.vue';
import NavBar from './components/NavBar.vue';
</script>

<template>
  <QLayout view="hHh LpR fff">
    <QHeader
      class="bg-primary text-white"
      elevated
    >
      <QToolbar class="bg-primary text-white">
        <NavBar />

        <QToolbarTitle class="text-center">Eisvana Discovery Data</QToolbarTitle>

        <ThemeSwitch />
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
