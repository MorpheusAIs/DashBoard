<template>
  <div class="zero-pool-description">
    <ul>
      <li
        v-for="(item, idx) in listItems"
        :key="idx"
        class="zero-pool-description__list-item"
      >
        {{ item }}
      </li>
    </ul>
    <p
      v-if="!web3ProvidersStore.dashboardInfo.distributionAddress"
      class="zero-pool-description__details"
    >
      {{ $t('zero-pool-description.details') }}
      <app-button
        class="zero-pool-description__details-link"
        scheme="link"
        target="_blank"
        rel="noopener noreferrer"
        text="GitHub"
        :href="$config.GITHUB_URL"
      />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useI18n } from '@/composables'
import { computed, defineProps } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { Time } from '@distributedlab/tools'
import { DAY_MONTH_TIME_FORMAT } from '@/const'

const props = defineProps<{
  withdrawAfter: '' | Time
  claimAfter: '' | Time
}>()

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()

const listItems = computed<string[]>(() => [
  t('zero-pool-description.list.1', {
    deposit: web3ProvidersStore.depositTokenSymbol,
    reward: web3ProvidersStore.rewardsTokenSymbol,
  }),
  t('zero-pool-description.list.2', {
    deposit: web3ProvidersStore.depositTokenSymbol,
    time: props.withdrawAfter
      ? props.withdrawAfter.format(DAY_MONTH_TIME_FORMAT)
      : '',
  }),
  t('zero-pool-description.list.3', {
    reward: web3ProvidersStore.rewardsTokenSymbol,
    time: props.claimAfter
      ? props.claimAfter.format(DAY_MONTH_TIME_FORMAT)
      : '',
  }),
  t('zero-pool-description.list.4', {
    reward: web3ProvidersStore.rewardsTokenSymbol,
  }),
])
</script>

<style lang="scss" scoped>
.zero-pool-description__list-item {
  display: flex;
  align-items: center;
  gap: toRem(8);

  &:before {
    content: '';
    height: toRem(6);
    width: toRem(6);
    background: var(--text-secondary-light);
    border-radius: 50%;
  }
}

.zero-pool-description__details {
  margin: toRem(16) 0 0 toRem(16);
}

.zero-pool-description .zero-pool-description__details-link {
  display: inline-block;
  overflow: unset;

  @include body-3-regular;
}
</style>
