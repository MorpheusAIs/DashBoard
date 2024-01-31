<template>
  <basic-modal
    class="claim-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('claim-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #subtitle>
      <i18n-t
        class="claim-modal__subtitle"
        keypath="claim-modal.subtitle"
        tag="p"
      >
        <template #reward>
          <span class="claim-modal__reward">
            {{ $t('claim-modal.reward', { amount }) }}
          </span>
        </template>
      </i18n-t>
    </template>
    <template #default="{ modal }">
      <div class="claim-modal__buttons-wrp">
        <app-button
          class="claim-modal__btn"
          color="secondary"
          :text="$t('claim-modal.close-btn')"
          @click="modal.close"
        />
        <app-button
          class="claim-modal__btn"
          :text="$t('claim-modal.claim-btn')"
          :disabled="isClaiming"
          @click="claim"
        />
      </div>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useContext, useContract } from '@/composables'
import {
  ETHEREUM_EXPLORER_URLS,
  ETHEREUM_RPC_URLS,
  LAYER_ZERO_ENDPOINTS,
} from '@/enums'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { config } from '@config'
import BasicModal from '../BasicModal.vue'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    amount: string
    poolId: number
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

const isClaiming = ref(false)

const { contractWithSigner: erc1967Proxy } = useContract(
  'ERC1967Proxy__factory',
  config.ERC1967_PROXY_CONTRACT_ADDRESS,
)

const { contractWithProvider: endpoint } = useContract(
  'Endpoint__factory',
  config.ENDPOINT_CONTRACT_ADDRESS,
  config.IS_MAINNET ? ETHEREUM_RPC_URLS.ethereum : ETHEREUM_RPC_URLS.sepolia,
)

const { $t } = useContext()
const web3ProvidersStore = useWeb3ProvidersStore()

const claim = async (): Promise<void> => {
  isClaiming.value = true

  try {
    const fees = await endpoint.value.estimateFees(
      config.IS_MAINNET
        ? LAYER_ZERO_ENDPOINTS.arbitrum
        : LAYER_ZERO_ENDPOINTS.arbitrumSepolia,
      config.ERC1967_PROXY_CONTRACT_ADDRESS,
      '0x'.concat('00'.repeat(64)),
      false,
      '0x',
    )

    const tx = await erc1967Proxy.value.claim(
      props.poolId,
      web3ProvidersStore.provider.selectedAddress,
      { value: fees.nativeFee },
    )

    const explorerTxUrl = getEthExplorerTxUrl(
      config.IS_MAINNET
        ? ETHEREUM_EXPLORER_URLS.ethereum
        : ETHEREUM_EXPLORER_URLS.sepolia,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      $t('claim-modal.tx-sent-message', { explorerTxUrl }),
    )

    emit('update:is-shown', false)

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      $t('claim-modal.success-message', { explorerTxUrl }),
    )

    bus.emit(BUS_EVENTS.changedCurrentUserReward)
  } catch (error) {
    ErrorHandler.process(error)
  }

  isClaiming.value = false
}
</script>

<style lang="scss" scoped>
.claim-modal__subtitle {
  font: inherit;
}

.claim-modal__reward {
  white-space: nowrap;

  @include body-1-semi-bold;
}

.claim-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.claim-modal .claim-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
