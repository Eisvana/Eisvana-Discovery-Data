import { createRouter, createWebHistory } from 'vue-router';
import ResultsTable from '../pages/ResultsTable.vue';
import Filtering from '../views/Filtering.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'filtering',
      component: Filtering,
      children: [
        {
          path: '/',
          name: 'home',
          component: ResultsTable,
        },
        {
          path: '/stats',
          name: 'stats',
          component: () => import('../pages/DiscoveryStats.vue'),
        },
        {
          path: '/charts',
          name: 'charts',
          component: () => import('../pages/DiscoveryCharts.vue'),
        },
      ],
    },
    {
      path: '/view',
      name: 'view',
      component: () => import('../views/ItemDisplay.vue'),
      children: [
        {
          path: '/planet/:glyphs',
          name: 'planetOverview',
          component: () => import('../pages/PlanetOverview.vue'),
        },
        {
          path: '/system/:glyphs',
          name: 'systemOverview',
          component: () => import('../pages/SystemOverview.vue'),
        },
      ],
    },
  ],
});

export default router;
