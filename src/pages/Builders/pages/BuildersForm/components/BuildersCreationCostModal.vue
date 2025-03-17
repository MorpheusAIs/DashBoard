<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="$t('builders-creation-cost-modal.modal-title')"
  >
    <loader v-if="!isLoaded" />
    <error-message v-else-if="isLoadFailed" />
    <template v-else>
      <div class="max-h-[80dvh] overflow-auto">
        <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
          <span class="text-textSecondaryMain typography-body3">
            {{
              $t('builders-creation-cost-modal.modal-description', {
                price: formatBalance(data.price, 18),
              })
            }}
          </span>

          <div
            class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20"
          />

          <div v-if="chain" class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-creation-cost-modal.network-lbl') }}
            </span>
            <chain-network-badge :chain="chain as EthereumChains" />
          </div>

          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-creation-cost-modal.subnet-lbl') }}
            </span>
            <span class="!font-bold text-textSecondaryMain typography-body3">
              {{ name }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-creation-cost-modal.admin-lbl') }}
            </span>
            <span class="!font-bold text-textSecondaryMain typography-body3">
              {{ abbrCenter(admin || '') }}
            </span>
          </div>

          <div
            class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20"
          />

          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-creation-cost-modal.balance-lbl') }}
            </span>
            <span class="!font-bold text-textSecondaryMain typography-body3">
              {{ `${formatBalance(data.balance, 18)} MOR` }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-textSecondaryMain typography-body3">
              {{ $t('builders-creation-cost-modal.balance-after-lbl') }}
            </span>
            <span class="!font-bold text-textSecondaryMain typography-body3">
              {{ `${formatBalance(data.balanceAfterCreation, 18)} MOR` }}
            </span>
          </div>
        </div>

        <div class="mt-10 flex items-center justify-center gap-4">
          <app-button
            scheme="filled"
            color="secondary"
            @click="emit('update:is-shown', false)"
          >
            {{ $t('builders-creation-cost-modal.cancel-btn') }}
          </app-button>
          <app-button @click="emit('create-subnet')">
            {{ $t('builders-creation-cost-modal.create-btn') }}
          </app-button>
        </div>
      </div>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import {
  BasicModal,
  AppButton,
  ChainNetworkBadge,
  Loader,
  ErrorMessage,
} from '@/common'

import { abbrCenter, formatBalance } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { EthereumChains } from '@config'
import { useLoad } from '@/composables'

defineProps<{
  isShown: boolean
  chain?: string
  name?: string
  admin?: string
}>()

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'create-subnet'): void
}>()

const { provider, rewardsContract, builderSubnetsContract } =
  useWeb3ProvidersStore()

const { data, isLoaded, isLoadFailed } = useLoad<{
  price: string
  balance: string
  balanceAfterCreation: string
}>(
  {
    price: '',
    balance: '',
    balanceAfterCreation: '',
  },
  async () => {
    const [bnBalance, subnetCost] = await Promise.all([
      rewardsContract?.providerBased?.value?.balanceOf(
        provider.selectedAddress,
      ),
      builderSubnetsContract?.providerBased?.value?.subnetCreationFeeAmount(),
    ])

    return {
      price: subnetCost?.toString() || '',
      balance: bnBalance?.toString() || '',
      balanceAfterCreation: bnBalance?.sub(subnetCost || '').toString() || '',
    }
  },
)
</script>

<style lang="scss" scoped></style>
