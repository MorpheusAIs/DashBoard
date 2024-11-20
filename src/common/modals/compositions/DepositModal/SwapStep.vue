<template>
  <form class="swap-step" @submit="submit">
    <h3 class="swap-step__balance">
      <span class="swap-step__desc-text">
        {{ $t('swap-step.balance-text') }}
      </span>
      <span class="swap-step__desc-amount">
        {{ parsedUserBalance }}
      </span>
    </h3>
    <input-field
      v-model="form.amount"
      :placeholder="$t(`swap-step.amount-placeholder`)"
      :error-message="getFieldErrorMessage('amount')"
      :disabled="isLoadFailed || !isLoaded"
      @blur="touchField('amount')"
    >
      <template #nodeRight>
        <app-button
          class="swap-step__input-btn"
          scheme="link"
          text="max"
          :disabled="isLoadFailed || !isLoaded || !Number(userBalance)"
          @click="inputMaxAmount"
        />
      </template>
    </input-field>
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
        type="submit"
        :text="mainButtonText"
        :disabled="!isFieldsValid || !isLoaded"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed, ref, watch, toRef } from 'vue'
import { ETHEREUM_CHAIN_IDS, SWAP_ASSETS_NAMES } from '@/enums'
import { InputField } from '@/fields'
import { useContract, useFormValidation, useI18n, useSwap } from '@/composables'
import { required, minEther, maxEther } from '@/validators'
import { SWAP_ASSETS } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler, roundNumber } from '@/helpers'
import { utils } from 'ethers'
import { AppButton } from '@/common'
import { config } from '@config'
import { parseUnits } from '@/utils'

const MIN_SWAP_AMOUNT = '0.001'

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

const chosenAssetSymbol = computed(
  () =>
    SWAP_ASSETS.find(({ symbol }) => symbol === props.chosenAsset)?.symbol ||
    '',
)

const { estimatedTokenOutAmount, estimatedGasCost, executeTrade } = useSwap(
  chosenAssetAddress.value,
  config.STETH_MAINNET_CONTRACT_ADDRESS,
  toRef(() => form.amount),
)

const validationRules = computed(() => ({
  amount: {
    required,
    minEther: minEther(parseUnits(MIN_SWAP_AMOUNT, 'ether')),
    ...(userBalance.value && {
      maxEther: maxEther(userBalance.value),
    }),
  },
}))

const { getFieldErrorMessage, isFieldsValid, touchField } = useFormValidation(
  form,
  validationRules,
)

const mainButtonText = computed(() => t('swap-step.confirm-btn'))

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
    chosenAssetAddress.value,
    web3ProvidersStore.l1Provider,
  ),
)

const parsedUserBalance = computed(
  () => `${userBalance.value} ${chosenAssetSymbol.value}`,
)

const humanizeEtherValue = (number: string, symbol: string) =>
  `${roundNumber(number)} ${symbol}`

const getUserBalance = async () => {
  await web3ProvidersStore.provider.switchChain(ETHEREUM_CHAIN_IDS.ethereum)
  const balance = await erc20Contract.value.providerBased.value.balanceOf(
    web3ProvidersStore.address,
  )
  const tokenDecimals = await erc20Contract.value.providerBased.value.decimals()

  userBalance.value = utils.formatUnits(
    balance.toString(),
    Number(tokenDecimals.toString()),
  )
}

const inputMaxAmount = () => {
  form.amount = userBalance.value
}

const submit = async () => {
  isLoaded.value = false
  try {
    await executeTrade()
    emit('swap-success')
  } catch (e) {
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}

const init = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await getUserBalance()
  } catch (e) {
    isLoadFailed.value = true
    ErrorHandler.processWithoutFeedback(e)
  }
  isLoaded.value = true
}

watch(
  [
    () => web3ProvidersStore.provider.chainId,
    () => web3ProvidersStore.provider.selectedAddress,
  ],
  init,
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

  @include respond-to(medium) {
    gap: toRem(16);
  }
}

.swap-step__balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: toRem(20);

  @include respond-to(medium) {
    flex-direction: column;
  }
}

.swap-step__desc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: toRem(8);

  @include respond-to(medium) {
    flex-direction: column;
  }
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

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.swap-step__button {
  width: toRem(200);
}

.swap-step__input-btn {
  @include body-3-semi-bold;
}
</style>
