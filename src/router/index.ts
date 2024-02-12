import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

import { ROUTE_NAMES } from '@/enums'
import { config } from '@/config'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: ROUTE_NAMES.app },
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    component: () => import('@/pages/HomePage/index.vue'),
    redirect: () => router.resolve({ name: ROUTE_NAMES.appCapital }).path,
    children: [
      {
        path: 'capital',
        name: ROUTE_NAMES.appCapital,
        component: () => import('@/pages/HomePage/views/PublicPoolView.vue'),
        props: { poolId: 0 },
      },
      ...(!config.IS_MAINNET
        ? [
            {
              path: 'community',
              name: ROUTE_NAMES.appCommunity,
              component: () =>
                import('@/pages/HomePage/views/PrivatePoolView.vue'),
              props: { poolId: 1 },
            },
          ]
        : []),
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory('./'),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

export { router, useRouter, useRoute }
