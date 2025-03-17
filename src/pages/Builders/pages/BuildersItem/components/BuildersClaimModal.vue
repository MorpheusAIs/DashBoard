<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    :title="$t('builders-claim-modal.modal-title')"
    :is-close-by-click-outside="!isSubmitting"
    :has-close-button="!isSubmitting"
  >
    <div class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <div v-if="chain" class="flex items-center justify-between">
          <span class="text-textSecondaryMain typography-body3">
            {{ $t('builders-claim-modal.network-lbl') }}
          </span>
          <chain-network-badge :chain="chain as EthereumChains" />
        </div>

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(0, 2)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(2, 5)"
          :key="i"
        >
          <span
            class="whitespace-pre-line text-textSecondaryMain typography-body3"
          >
            {{ el.label }}
          </span>
          <span class="!font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          class="flex items-start justify-between"
          v-for="(el, i) in builderDetails.slice(5)"
          :key="i"
        >
          <span class="whitespace-nowrap text-textSecondaryMain typography-h4">
            {{ el.label }}
          </span>
          <span
            class="text-right !font-bold text-textSecondaryMain typography-h4"
          >
            {{ el.value }}
          </span>
        </div>
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
          :disabled="isSubmitting"
        >
          {{ $t('builders-claim-modal.cancel-btn') }}
        </app-button>
        <app-button @click="claim" :disabled="isSubmitting">
          {{ $t('builders-claim-modal.submit-btn') }}
        </app-button>
      </div>
    </div>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal, ChainNetworkBadge } from '@/common'
import { useI18n, useLoad } from '@/composables'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { computed, ref } from 'vue'
import {
  abbrCenter,
  bus,
  BUS_EVENTS,
  ErrorHandler,
  formatAmount,
  getEthExplorerTxUrl,
  sleep,
} from '@/helpers'
import { formatEther } from '@/utils'
import { BuilderSubnetDefaultFragment } from '@/types/graphql'
import { BN } from '@distributedlab/tools'
import { EthereumChains } from '@config'

const props = withDefaults(
  defineProps<{
    builderSubnet: BuilderSubnetDefaultFragment
    claimReceiver: string
    stakerRewards: string
    isShown?: boolean
    chain?: string
  }>(),
  {
    isShown: true,
    chain: undefined,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
  (e: 'claimed'): void
}>()

const { t } = useI18n()

const {
  provider,
  builderSubnetsContract,
  builderSubnetsContractDetails,
  feeConfigContract,
} = storeToRefs(useWeb3ProvidersStore())

const isSubmitting = ref(false)

const { data: protocolFee } = useLoad(
  '',
  async () => {
    const res =
      await feeConfigContract.value.providerBased.value.getFeeAndTreasuryForOperation(
        props.claimReceiver,
        '0x0e619df840e43eeee4aeaa3968c0faee58f09a7a73123ecda6e02d944995c90e',
      )

    return res[0].toString()
  },
  {
    reloadArgs: [
      () => props.claimReceiver,
      () => props.builderSubnet.feeTreasury,
    ],
  },
)

const builderDetails = computed(() => [
  {
    label: t('builders-claim-modal.subnet-lbl'),
    value: props.builderSubnet.name,
  },
  {
    label: t('builders-claim-modal.claim-receiver-lbl'),
    value: abbrCenter(props.claimReceiver),
  },
  {
    label: t('builders-claim-modal.amount-lbl'),
    value: `${formatEther(props.stakerRewards)} MOR`,
  },
  {
    label: t('builders-claim-modal.protocol-fee-lbl'),
    value: `${formatAmount(protocolFee.value, 23, {
      decimals: 23,
    })}%`,
  },
  {
    label: t('builders-claim-modal.emissions-lbl'),
    value: `${formatAmount(props.builderSubnet.fee, 23, {
      decimals: 23,
    })}%`,
  },
  {
    label: t('builders-claim-modal.final-claim-lbl'),
    value: `${BN.fromBigInt(props.stakerRewards ?? 0)
      .sub(
        BN.fromBigInt(props.stakerRewards ?? 0)
          .div(BN.fromRaw(100))
          .mul(BN.fromBigInt(protocolFee.value || 0, 23)),
      )
      .sub(
        BN.fromBigInt(props.stakerRewards ?? 0)
          .div(BN.fromRaw(100))
          .mul(BN.fromBigInt(props.builderSubnet.fee || 0, 23)),
      )
      .format({
        decimals: 4,
      })} MOR`,
  },
])

const claim = async () => {
  isSubmitting.value = true
  try {
    if (
      provider.value.chainId !==
      builderSubnetsContractDetails.value.targetChainId
    ) {
      provider.value.selectChain(
        builderSubnetsContractDetails.value.targetChainId,
      )
      await sleep(1_000)
    }

    const tx = await builderSubnetsContract.value.signerBased.value.claim(
      props.builderSubnet?.id,
      props.claimReceiver,
    )

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction receipt is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      builderSubnetsContractDetails.value.explorerUrl,
      txReceipt.transactionHash,
    )

    emit('claimed')

    bus.emit(
      BUS_EVENTS.success,
      t('builders-item.claim-success-msg', { explorerTxUrl }),
    )
  } catch (error) {
    ErrorHandler.process(error)
  }
  isSubmitting.value = false
}
</script>

<style lang="scss">
.stake-modal__details-label {
  font-size: toRem(16);
  line-height: toRem(24);
}

.stake-modal__details-value {
  font-size: toRem(16);
  font-weight: 700;
  line-height: toRem(24);
}

.stake-modal__callout-text {
  font-size: toRem(20);
  line-height: toRem(30);
}

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}

.v-popper--theme-dropdown .v-popper__inner {
  @apply max-w-[270px] border-none bg-[#030807] p-4;
}
</style>
