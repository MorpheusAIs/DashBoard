import { NETWORK_IDS, ROUTE_NAMES } from '@/enums'
import { sleep } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import {
  onBeforeRouteUpdate,
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  useRoute,
  useRouter,
} from 'vue-router'

const routes: RouteRecordRaw[] = [
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
      {
        path: 'community',
        name: ROUTE_NAMES.appCommunity,
        component: () => import('@/pages/HomePage/views/PrivatePoolView.vue'),
        props: { poolId: 1 },
      },
      {
        path: 'builders',
        name: ROUTE_NAMES.appBuilders,
        component: () => import('@/pages/Builders/index.vue'),
        children: [
          {
            path: '',
            name: ROUTE_NAMES.appBuildersList,
            component: () =>
              import('@/pages/Builders/pages/BuildersList/index.vue'),
          },
          {
            path: ':id',
            name: ROUTE_NAMES.appBuildersItem,
            component: () =>
              import('@/pages/Builders/pages/BuildersItem/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    name: ROUTE_NAMES.appDashboard,
    component: () => import('@/pages/HomePage/index.vue'),
    redirect: () =>
      router.resolve({ name: ROUTE_NAMES.appDashboardCapital }).path,
    children: [
      {
        path: 'capital',
        name: ROUTE_NAMES.appDashboardCapital,
        component: () => import('@/pages/HomePage/views/PublicPoolView.vue'),
        props: { poolId: 0 },
      },
    ],
  },
  {
    path: '/mor20-ecosystem',
    children: [
      {
        path: '',
        name: ROUTE_NAMES.appMor20EcosystemMain,
        component: () => import('@/pages/Mor20Ecosystem/MainPage.vue'),
      },
      {
        path: 'protocol-creation',
        name: ROUTE_NAMES.appMor20EcosystemProtocolCreation,
        component: () =>
          import('@/pages/Mor20Ecosystem/ProtocolCreationPage.vue'),
        beforeEnter: async to => {
          const { provider } = useWeb3ProvidersStore()

          if (!provider.selectedAddress) {
            await sleep(1000)
          }

          if (!provider.selectedAddress)
            return { ...to, name: ROUTE_NAMES.appMor20EcosystemMain }
        },
      },
    ],
  },
  {
    path: '/contract-info',
    name: ROUTE_NAMES.contractInfo,
    component: () => import('@/pages/ContractInfoPage/index.vue'),
  },
  {
    path: '/referrals',
    name: ROUTE_NAMES.appReferrals,
    component: () => import('@/pages/Referrals/index.vue'),
    props: { poolId: 0 },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, left: 0 }),
})

router.beforeEach((to, from) => {
  if (to.query.network) return

  if (from.query.referrer) {
    to.query.referrer = from.query.referrer
  }

  to.query.network =
    to.query.network || from.query.network || NETWORK_IDS.mainnet

  return { ...to, query: { ...to.query } }
})

export { onBeforeRouteUpdate, router, useRouter, useRoute }
