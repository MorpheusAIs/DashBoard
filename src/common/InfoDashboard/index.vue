<template>
  <div class="info-dashboard" :class="{ 'info-dashboard--loading': isLoading }">
    <transition name="fade" mode="out-in">
      <div v-if="web3ProvidersStore.isConnected" class="info-dashboard__wrp">
        <template v-if="isChartShown">
          <div class="info-dashboard__header">
            <div class="info-dashboard__header-title-wrp">
              <h5 class="info-dashboard__header-title">
                {{ chartTitle }}
              </h5>
              <app-icon
                v-tooltip="$t('info-dashboard.header-note')"
                class="info-dashboard__header-title-icon"
                :name="$icons.exclamationCircle"
              />
            </div>
            <div class="info-dashboard__header-buttons">
              <app-button
                class="info-dashboard__header-button"
                scheme="filled"
                color="secondary"
                size="none"
                :disabled="chartType === CHART_TYPE.earnedMor"
                :icon-left="$icons.arrowLeft"
                @click="changeChartType(CHART_TYPE.earnedMor)"
              />
              <app-button
                class="info-dashboard__header-button"
                scheme="filled"
                color="secondary"
                size="none"
                :disabled="chartType === CHART_TYPE.circulingSupply"
                :icon-left="$icons.arrowLeft"
                @click="changeChartType(CHART_TYPE.circulingSupply)"
              />
            </div>
          </div>
          <div class="info-dashboard__app-chart-wrp">
            <div class="info-dashboard__app-chart-desc">
              <p class="info-dashboard__header-subtitle">
                {{ chartSubtitle }}
              </p>
              <div class="info-dashboard__header-fields">
                <select-field
                  v-model="selectedMonth"
                  scheme="secondary"
                  :value-options="monthOptions"
                />
                <select-field
                  v-model="selectedYear"
                  scheme="secondary"
                  :value-options="yearOptions"
                />
              </div>
            </div>
            <app-chart
              class="info-dashboard__app-chart"
              :config="chartConfig"
              :is-loading="isLoading || isChartDataUpdating"
            />
          </div>
        </template>
        <ul
          v-if="indicators?.length"
          class="info-dashboard__indicators"
          :class="{ 'info-dashboard__indicators--border': isChartShown }"
        >
          <info-indicator
            v-for="(indicator, idx) in indicators"
            :key="idx"
            :icon-name="indicator.iconName"
            :title="indicator.title"
            :is-loading="isLoading"
            :value="indicator.value"
          />
          <template v-if="isChartShown && !isNoReferrer">
            <div class="info-dashboard__separator" />
            <div class="info-dashboard__ref-info">
              <info-indicator
                v-for="(refIndicator, idx) in refererIndicators"
                :key="idx"
                :title="refIndicator.title"
                :value="refIndicator?.value"
                :link="refIndicator?.link"
                :is-loading="isLoading"
              />
            </div>
          </template>
        </ul>
        <div v-if="$slots.default" class="info-dashboard__slot-wrp">
          <slot />
        </div>
      </div>
      <div v-else class="info-dashboard__wrp">
        <img
          class="info-dashboard__logo"
          src="/branding/info-dashboard-logo.svg"
          alt="info-dashboard-logo"
        />
        <p class="info-dashboard__connection-msg">
          {{ $t('info-dashboard.connection-msg') }}
        </p>
        <connect-wallet-button class="info-dashboard__connect-wallet-btn" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { useI18n, usePool } from '@/composables'
import { SelectField } from '@/fields'
import { abbrCenter, ErrorHandler } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import type {
  ChartConfig,
  Erc1967ProxyType,
  FieldOption,
  InfoDashboardType,
  Mor1967ProxyType,
} from '@/types'
import { Time, formatEther } from '@/utils'
import { computed, onMounted, reactive, ref, toRef, watch } from 'vue'
import { CHART_CONFIG } from './const'
import { getUserYieldPerDayChartData, getChartData } from './helpers'
import AppIcon from '../AppIcon.vue'
import AppChart from '../AppChart.vue'
import ConnectWalletButton from '../ConnectWalletButton.vue'
import { AppButton, InfoIndicator } from '@/common'
import { ROUTE_NAMES } from '@/enums'
import { useRoute, useRouter } from 'vue-router'
import { errors } from '@/errors'
import { ethers } from 'ethers'
import { config } from '@config'
import { useFirstApolloClient } from '@/composables/use-first-apollo-client'

const CUT_ADDRESS_LENGTH = 7

enum CHART_TYPE {
  circulingSupply = 'circulating-supply',
  earnedMor = 'earned-mor',
}

const CHART_COLORS = {
  [CHART_TYPE.earnedMor]: '#D3E229',
  [CHART_TYPE.circulingSupply]: '#FF7C03',
}

const REFERRAL_REWARD = 1 //%

const props = withDefaults(
  defineProps<{
    poolId: number
    poolData: Erc1967ProxyType.PoolData | Mor1967ProxyType.PoolData | null
    indicators?: InfoDashboardType.Indicator[]
    isLoading?: boolean
  }>(),
  {
    indicators: () => [],
    isLoading: false,
  },
)

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { userPoolData } = usePool(toRef(props.poolId))

const web3ProvidersStore = useWeb3ProvidersStore()

const chartType = ref(CHART_TYPE.earnedMor)

const isChartDataUpdating = ref(false)

const chartConfig = reactive<ChartConfig>({ ...CHART_CONFIG })

const isNoReferrer = computed(() => {
  const referrer = (userPoolData.value as Erc1967ProxyType.UserData)?.referrer
  return !referrer || referrer === ethers.constants.AddressZero
})

const yearOptions = computed<FieldOption<number>[]>(() => {
  const currentTime = new Time()
  const currentYear = currentTime.get('year')

  return Array.from({
    length: currentYear - config.metadata.yearOfLaunch + 1,
  }).map((_, idx) => ({
    title: String(config.metadata.yearOfLaunch + idx),
    value: config.metadata.yearOfLaunch + idx,
  }))
})

const selectedYear = ref(yearOptions.value[yearOptions.value.length - 1])

const monthOptions = computed<FieldOption<number>[]>(() => {
  const allMonthOptions = Array.from({ length: 12 }).map((_, idx) => ({
    title: t(`months.${idx}`),
    value: idx,
  }))

  const currentTime = new Time()
  const month = currentTime.get('month')

  const firstSlice =
    selectedYear.value.value === config.metadata.yearOfLaunch
      ? config.metadata.monthOfLaunch
      : 0
  const secondSlice =
    selectedYear.value.value === currentTime.get('year') ? month + 1 : 12

  return allMonthOptions.slice(firstSlice, secondSlice)
})

const selectedMonth = ref(monthOptions.value[monthOptions.value.length - 1])

const refererIndicators = computed(() => {
  const link = router.resolve({
    name: ROUTE_NAMES.appReferrals,
    query: {
      user: (userPoolData.value as Erc1967ProxyType.UserData)?.referrer,
      network: route.query.network,
    },
  }).href

  return [
    {
      title: t('info-dashboard.referee-bonus-text'),
      value: `${REFERRAL_REWARD}%`,
    },
    {
      title: t('info-dashboard.your-referrer-text'),
      value: abbrCenter(
        (userPoolData.value as Erc1967ProxyType.UserData)?.referrer ?? '-',
        CUT_ADDRESS_LENGTH,
      ),
      link,
    },
  ]
})

const chartTitle = computed(() =>
  chartType.value === CHART_TYPE.circulingSupply
    ? t('info-dashboard.header-supply-title')
    : t('info-dashboard.header-earned-title'),
)

const chartSubtitle = computed(() =>
  chartType.value === CHART_TYPE.circulingSupply
    ? t('info-dashboard.header-supply-subtitle')
    : t('info-dashboard.header-earned-subtitle'),
)

const isChartShown = computed(
  () => route.name !== ROUTE_NAMES.appDashboardCapital,
)

const apolloClient = useFirstApolloClient()

const updateSupplyChartData = async (month: number, year: number) => {
  const chartData = await getChartData(
    props.poolId,
    props.poolData!.payoutStart,
    month,
    year,
    apolloClient.value,
  )

  const monthTime = new Time(String(month + 1), 'M')

  chartConfig.data.labels = Object.keys(chartData).map(
    day => `${monthTime.format('MMMM')} ${day}`,
  )
  chartConfig.data.datasets[0].data = Object.values(chartData).map(amount =>
    Math.ceil(Number(formatEther(amount))),
  )

  chartConfig.data.datasets[0].borderColor =
    CHART_COLORS[CHART_TYPE.circulingSupply]
  chartConfig.data.datasets[0].pointBackgroundColor =
    CHART_COLORS[CHART_TYPE.circulingSupply]
}

const updateEarnedMorChartData = async (month: number, year: number) => {
  const chartData = await getUserYieldPerDayChartData(
    props.poolId,
    web3ProvidersStore.address,
    month,
    year,
    apolloClient.value,
  )

  chartConfig.data.labels = Object.keys(chartData).map(timestamp => {
    return new Time(Number(timestamp)).format('DD MMMM')
  })

  chartConfig.data.datasets[0].data = Object.values(chartData).map(amount =>
    Number(formatEther(amount)),
  )

  chartConfig.data.datasets[0].borderColor = CHART_COLORS[CHART_TYPE.earnedMor]
  chartConfig.data.datasets[0].pointBackgroundColor =
    CHART_COLORS[CHART_TYPE.earnedMor]
}

const updateChartData = async (month: number, year: number) => {
  isChartDataUpdating.value = true

  try {
    if (!props.poolData) throw new errors.PoolDataNotFoundError()

    chartType.value === CHART_TYPE.circulingSupply
      ? await updateSupplyChartData(month, year)
      : await updateEarnedMorChartData(month, year)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isChartDataUpdating.value = false
}

const changeChartType = (chartToSet: CHART_TYPE) => {
  chartType.value = chartToSet
}

onMounted(() => {
  if (props.poolData)
    updateChartData(
      selectedMonth.value.value,
      selectedYear.value?.value || new Time().get('year'),
    )
})

watch(
  [selectedMonth, selectedYear, () => props.poolData, chartType],
  async ([newSelectedMonth]) => {
    if (!props.isLoading)
      await updateChartData(
        newSelectedMonth.value,
        selectedYear.value?.value || new Time().get('year'),
      )
  },
)
</script>

<style lang="scss" scoped>
.info-dashboard {
  padding: toRem(24) toRem(20) toRem(30);
  height: max-content;
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    -84deg,
    rgba(var(--white-rgb), 0.48),
    rgba(var(--white-rgb), 0.08)
  );
  background: linear-gradient(
      -84deg,
      rgba(57, 99, 58, 0.04),
      rgba(38, 57, 57, 0.5)
    )
    padding-box;

  @include respond-to(medium) {
    padding: toRem(20) toRem(16) toRem(22);
  }
}

.info-dashboard__wrp {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info-dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: toRem(18);
}

.info-dashboard__header-buttons {
  display: flex;
  gap: toRem(12);
}

.info-dashboard__header-button {
  width: toRem(48);
  height: toRem(48);

  &:last-child {
    transform: rotateY(180deg);
  }

  @include respond-to(medium) {
    width: toRem(32);
    height: toRem(32);
  }
}

.info-dashboard__header-title-wrp {
  display: flex;
  align-items: center;
  gap: toRem(12);
}

.info-dashboard__header-title {
  @include body-2-semi-bold;
}

.info-dashboard .info-dashboard__header-title-icon {
  $color: #cccccc;

  color: $color;
  height: toRem(24);
  width: toRem(24);
  pointer-events: unset;
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &:hover {
    color: var(--text-secondary-light);
  }
}

.info-dashboard__header-subtitle {
  $color: #cccccc;

  color: $color;

  @include body-6-regular;
}

.info-dashboard__header-fields {
  display: flex;
  gap: toRem(8);
}

.info-dashboard__app-chart-wrp {
  margin-top: toRem(16);
  border-top: toRem(2) solid var(--border-tertiary-main);
  width: 100%;
}

.info-dashboard__app-chart-desc {
  margin: toRem(20) 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-dashboard .info-dashboard__app-chart {
  height: toRem(242);
}

.info-dashboard__indicators {
  width: 100%;
  display: grid;
  grid-gap: toRem(8);

  &--border {
    margin-top: toRem(16);
    padding-top: toRem(24);
    border-top: toRem(2) solid var(--border-tertiary-main);
  }
}

.info-dashboard__slot-wrp {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: toRem(24);

  .info-dashboard__indicators + & {
    margin-top: toRem(28);

    @include respond-to(medium) {
      margin-top: toRem(24);
    }
  }
}

.info-dashboard__logo {
  height: toRem(220);
  width: toRem(160);

  @include respond-to(medium) {
    height: toRem(112);
    width: toRem(80);
  }
}

.info-dashboard__connection-msg {
  margin-top: toRem(24);
  text-align: center;
}

.info-dashboard .info-dashboard__connect-wallet-btn {
  margin-top: toRem(24);
  min-width: toRem(190);

  @include respond-to(medium) {
    min-width: toRem(162);
  }
}

.info-dashboard__ref-info {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.info-dashboard__separator {
  margin: toRem(16) 0;
  height: toRem(2);
  width: 100%;
  background: var(--border-tertiary-main);
}
</style>
