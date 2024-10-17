<template>
  <div class="swap-step">
    <p class="swap-step__lbl">
      <span class="swap-step__lbl swap-step__lbl--highlighted">
        {{ $t('swap-step.step-txt') }}
      </span>
      {{ $t('swap-step.swap-for-txt', { asset: chosenAsset }) }}
    </p>
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
        <span class="swap-step__desc-amount"> {{ estimatedTokenIn }} </span>
      </div>
      <div class="swap-step__desc">
        <span class="swap-step__desc-text">
          {{ $t('swap-step.estimated-fee-text') }}
        </span>
        <span class="swap-step__desc-amount"> {{ estimatedFee }} </span>
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
        :text="$t('swap-step.confirm-btn')"
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
import { useContract, useFormValidation, useSwap } from '@/composables'
import { required, minEther } from '@/validators'
import { SWAP_ASSETS } from '@/const'
import { useWeb3ProvidersStore } from '@/store'
import { ErrorHandler } from '@/helpers'
import { utils } from 'ethers'
import { AppButton } from '@/common'
import { config } from '@config'

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const props = defineProps<{
  chosenAsset: SWAP_ASSETS_NAMES
}>()

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

const { estimatedTokenIn, estimatedFee, executeTrade } = useSwap(
  chosenAssetAddress.value,
  config.STETH_MAINNET_CONTRACT_ADDRESS,
  toRef(() => form.amount),
)

const tokenAddress = computed(
  () =>
    SWAP_ASSETS.find(({ symbol }) => symbol === props.chosenAsset)?.address ||
    '',
)

const erc20Contract = computed(() =>
  useContract(
    'ERC20__factory',
    tokenAddress.value,
    web3ProvidersStore.l1Provider,
  ),
)

const { getFieldErrorMessage, isFieldsValid, touchField } = useFormValidation(
  form,
  {
    amount: {
      required,
      minEther: minEther(0),
      // maxEther: maxEther(userBalance.value),
    },
  },
)

const getUserBalance = async () => {
  isLoaded.value = false
  isLoadFailed.value = false
  try {
    await web3ProvidersStore.provider.switchChain(ETHEREUM_CHAIN_IDS.ethereum)
    const balance = await erc20Contract.value.providerBased.value.balanceOf(
      '0xd17b3c9784510E33cD5B87b490E79253BcD81e2E',
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
    await executeTrade()
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
.swap-step__lbl {
  font-size: toRem(20);
  line-height: toRem(30);
  margin: toRem(32) 0 toRem(24);

  &--highlighted {
    color: var(--primary-main);
  }
}

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
