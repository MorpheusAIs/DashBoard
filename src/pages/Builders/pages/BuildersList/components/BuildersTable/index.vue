<template>
  <div class="flex w-full flex-col gap-2">
    <div
      :class="
        cn(
          'hidden',
          'grid-cols-[max(216px),max(160px),max(190px),1fr,1fr,max(100px)] items-center md:grid',
          'gap-2 px-8',
        )
      "
    >
      <div class="flex items-center gap-2">
        <span
          class="line-clamp-1 text-[16px] leading-[24px] text-textTertiaryMain"
        >
          {{ $t('builders-table.name-th') }}
        </span>
      </div>
      <sorting-icon-button
        class="justify-self-end"
        :label="$t('builders-table.reward-type-th')"
        :order-by="AdditionalBuildersOrderBy.RewardType"
        v-model:order-by-model="orderByModel"
        v-model:order-direction-model="orderDirectionModel"
      />
      <sorting-icon-button
        class="justify-self-end"
        :label="$t('builders-table.min-deposit-th')"
        :order-by="BuildersProject_OrderBy.MinimalDeposit"
        v-model:order-by-model="orderByModel"
        v-model:order-direction-model="orderDirectionModel"
      />
      <sorting-icon-button
        class="justify-self-end"
        :label="$t('builders-table.total-staked-th')"
        :order-by="BuildersProject_OrderBy.TotalStaked"
        v-model:order-by-model="orderByModel"
        v-model:order-direction-model="orderDirectionModel"
      />
      <sorting-icon-button
        class="justify-self-end"
        :label="$t('builders-table.withdraw-lock-period-th')"
        :order-by="BuildersProject_OrderBy.WithdrawLockPeriodAfterDeposit"
        v-model:order-by-model="orderByModel"
        v-model:order-direction-model="orderDirectionModel"
      />
      <div class=""></div>
    </div>
    <!-- FIXME: el.chain: inserted in BuildersList.vue in loadFn -->
    <builders-table-item
      v-for="el in buildersProjects"
      :key="el.id"
      :builder-project="el"
      :chain="el.chain"
    />
  </div>
</template>

<script setup lang="ts">
import BuildersTableItem from './components/BuildersTableItem.vue'
import {
  BuilderProjectFragment,
  BuildersProject_OrderBy,
} from '@/types/graphql'
import { cn } from '@/theme/utils'
import SortingIconButton from './components/SortingIconButton.vue'
import { AdditionalBuildersOrderBy } from '@/enums'
import { EthereumChains } from '@config'

const orderByModel = defineModel<string>('orderByModel')
const orderDirectionModel = defineModel<string>('orderDirectionModel')

withDefaults(
  defineProps<{
    buildersProjects: ({ chain?: EthereumChains } & BuilderProjectFragment)[]
  }>(),
  {},
)
</script>

<style scoped lang="scss"></style>
