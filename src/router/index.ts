import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.uiKit },
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    component: () => import('@/pages/HomePage/index.vue'),
    redirect: () => router.resolve({ name: ROUTE_NAMES.appCommunity }).path,
    children: [
      {
        path: 'community',
        name: ROUTE_NAMES.appCommunity,
        component: () => import('@/pages/HomePage/views/CommunityView.vue'),
      },
      {
        path: 'coders',
        name: ROUTE_NAMES.appCoders,
        component: () => import('@/pages/HomePage/views/CodersView.vue'),
      },
      {
        path: 'compute',
        name: ROUTE_NAMES.appCompute,
        component: () => import('@/pages/HomePage/views/ComputeView.vue'),
      },
      {
        path: 'capital',
        name: ROUTE_NAMES.appCapital,
        component: () => import('@/pages/HomePage/views/CapitalView.vue'),
      },
    ],
  },
  {
    path: '/ui-kit',
    name: ROUTE_NAMES.uiKit,
    component: () => import('@/pages/UiKitPage.vue'),
  },
  {
    path: '/complex-form',
    name: ROUTE_NAMES.complexForm,
    component: () => import('@/forms/ComplexForm.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
