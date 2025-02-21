<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="$t('builders-creation-modal.modal-title')"
  >
    <div class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <span class="text-textSecondaryMain typography-body3">
          {{
            $t('builders-creation-modal.modal-description', {
              price: formatBalance(price, 18),
            })
          }}
        </span>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div v-if="chain" class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-creation-modal.network-lbl') }}
          </span>
          <chain-network-badge :chain="chain as EthereumChains" />
        </div>

        <div class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-creation-modal.subnet-lbl') }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ name }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-creation-modal.admin-lbl') }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ abbrCenter(admin || '') }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-creation-modal.balance-lbl') }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ `${formatBalance(balance, 18)} MOR` }}
          </span>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-creation-modal.balance-after-lbl') }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ `${formatBalance(balanceAfterCreation, 18)} MOR` }}
          </span>
        </div>
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
        >
          {{ $t('builders-creation-modal.cancel-btn') }}
        </app-button>
        <app-button @click="emit('create-subnet')">
          {{ $t('builders-creation-modal.create-btn') }}
        </app-button>
      </div>
    </div>
  </basic-modal>
</template>

<script lang="ts" setup>
import { BasicModal, AppButton, ChainNetworkBadge } from '@/common'

import { abbrCenter, formatBalance } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { EthereumChains } from '@config'
import { ref } from 'vue'

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

const price = ref('-')
const balance = ref('')
const balanceAfterCreation = ref('')

const init = async () => {
  const [bnBalance, subnetCost] = await Promise.all([
    rewardsContract?.providerBased?.value?.balanceOf(provider.selectedAddress),
    builderSubnetsContract?.providerBased?.value?.subnetCreationFeeAmount(),
  ])

  price.value = subnetCost?.toString()
  balance.value = bnBalance?.toString()
  balanceAfterCreation.value = bnBalance?.sub(subnetCost)?.toString()
}

init()
</script>

<style lang="scss" scoped></style>
