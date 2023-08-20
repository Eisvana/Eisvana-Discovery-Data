import { createRouter, createWebHistory } from 'vue-router'
import ResultsTable from '../pages/ResultsTable.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ResultsTable
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('../pages/DiscoveryStats.vue')
    },
    {
      path: '/charts',
      name: 'charts',
      component: () => import('../pages/DiscoveryCharts.vue')
    },
  ]
})

export default router
