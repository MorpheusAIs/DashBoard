<template>
  <div class="swap-step">
    <input-field
      v-model="form.amount"
      :placeholder="$t(`swap-step.amount-placeholder`)"
      :error-message="getFieldErrorMessage('amount')"
      :disabled="isLoadFailed || !isLoaded"
      @blur="touchField('amount')"
    />
    <div class="swap-step__desc-wrp">
      <div class="swap-step__desc">
        <span class="swap-step__desc-text">
          {{ $t('swap-step.eth-amount-text') }}
        </span>
        <span class="swap-step__desc-amount">
          {{ humanizedEstimations.estimatedTokenOutAmount }}
        </span>
      </div>
      <div class="swap-step__desc">
        <span class="swap-step__desc-text">
          {{ $t('swap-step.estimated-fee-text') }}
        </span>
        <span class="swap-step__desc-amount">
          {{ humanizedEstimations.estimatedGasCost }}
        </span>
      </div>
    </div>
    <div class="swap-step__buttons">
      <app-button
        class="swap-step__button"
        color="secondary"
        :text="$t('swap-step.cancel-btn')"
        @click="emit('cancel')"
      />
      <app-button
        class="swap-step__button"
        :text="mainButtonText"
        :disabled="!isFieldsValid"
        @click="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch, toRef } from 'vue'
import { ETHEREUM_CHAIN_IDS, SWAP_ASSETS_NAMES } from '@/enums'
import { InputField } from '@/fields'
import { useContract, useFormValidation, useI18n, useSwap } from '@/composables'
import { required, minEther, maxEther } from '@/validators'
import { SWAP_ASSETS } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { utils } from 'ethers'
import { AppButton } from '@/common'
import { config } from '@config'

const PRECISION = 5

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'swap-success'): void
}>()

const props = defineProps<{
  chosenAsset: SWAP_ASSETS_NAMES
}>()

const { t } = useI18n()
const web3ProvidersStore = useWeb3ProvidersStore()

const isLoaded = ref(false)
const isLoadFailed = ref(true)
const userBalance = ref('')

const form = reactive({
  amount: '',
})

const chosenAssetAddress = computed(
  () =>
    SWAP_ASSETS.find(({ symbol }) => symbol === props.chosenAsset)?.address ||
    '',
)

const {
  estimatedTokenOutAmount,
  estimatedGasCost,
  isApproved,
  executeTrade,
  approveRouter,
  calculateTrade,
} = useSwap(
  chosenAssetAddress.value,
  config.STETH_MAINNET_CONTRACT_ADDRESS,
  toRef(() => form.amount),
)

const { getFieldErrorMessage, isFieldsValid, touchField } = useFormValidation(
  form,
  {
    amount: {
      required,
      minEther: minEther(0),
      maxEther: computed(() => maxEther(userBalance.value)),
    },
  },
)

const mainButtonText = computed(() =>
  isApproved.value ? t('swap-step.confirm-btn') : t('swap-step.approve-btn'),
)

const tokenAddress = computed(
  () =>
    SWAP_ASSETS.find(({ symbol }) => symbol === props.chosenAsset)?.address ||
    '',
)

const humanizedEstimations = computed(() => ({
  estimatedTokenOutAmount: humanizeEtherValue(
    estimatedTokenOutAmount.value,
    SWAP_ASSETS_NAMES.STETH,
  ),
  estimatedGasCost: humanizeEtherValue(
    estimatedGasCost.value,
    config.chainsMap[ETHEREUM_CHAIN_IDS.ethereum].nativeCurrency.name,
  ),
}))

const erc20Contract = computed(() =>
  useContract(
    'ERC20__factory',
    tokenAddress.value,
    web3ProvidersStore.l1Provider,
  ),
)

const humanizeEtherValue = (number: string, symbol: string) =>
  `${parseFloat(Number(number).toFixed(PRECISION))} ${symbol}`

const getUserBalance = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await web3ProvidersStore.provider.switchChain(ETHEREUM_CHAIN_IDS.ethereum)
    const balance = await erc20Contract.value.providerBased.value.balanceOf(
      web3ProvidersStore.address,
    )
    userBalance.value = utils.formatEther(balance.toString())
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

const submit = async () => {
  try {
    const tx = isApproved.value ? await executeTrade() : await approveRouter()
    if (!tx) return

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.info,
      t('deposit-form.tx-sent-message', { explorerTxUrl }),
    )

    await tx.wait()

    bus.emit(
      BUS_EVENTS.success,
      t('deposit-form.success-message', { explorerTxUrl }),
    )

    if (isApproved.value) {
      emit('swap-success')
    }

    await calculateTrade()
  } catch (e) {
    ErrorHandler.process(e)
  }
}

watch(
  [
    () => web3ProvidersStore.provider.chainId,
    () => web3ProvidersStore.provider.selectedAddress,
  ],
  getUserBalance,
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.swap-step__desc-wrp {
  display: flex;
  margin-top: toRem(20);
  flex-direction: column;
  gap: toRem(8);
}

.swap-step__desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(8);
}

.swap-step__desc-text {
  font-size: toRem(20);
  line-height: toRem(30);
}

.swap-step__desc-amount {
  font-size: toRem(22);
  font-weight: 700;
  line-height: toRem(30);
}

.swap-step__buttons {
  display: flex;
  justify-content: center;
  gap: toRem(16);
  margin-top: toRem(40);
}

.swap-step__button {
  width: toRem(200);
}
</style>
