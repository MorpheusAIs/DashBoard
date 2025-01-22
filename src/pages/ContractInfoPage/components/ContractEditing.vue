<template>
  <div class="contract-editing">
    <h4 class="contract-editing__title">
      {{ $t('contract-editing.title') }}
    </h4>
    <span class="contract-editing__note">
      {{ methodToEdit.note }}
    </span>
    <div
      v-if="methodToEdit.methodName !== CONTRACT_METHODS.renounceOwnership"
      class="contract-editing__inputs"
    >
      <div
        v-for="({ id, displayedName }, index) in methodToEdit?.inputs"
        :key="displayedName"
        class="contract-editing__input-wrp"
      >
        <input-field
          class="contract-editing__input"
          :placeholder="displayedName"
          :error-message="getFieldErrorMessage(`input-${id}`)"
          :disabled="isSubmitting || isSubmitted"
          :model-value="form[`input-${id}`] || ''"
          @blur="touchField(`input-${id}`)"
          @update:model-value="updateFormField(id, $event)"
        />
        <div
          v-if="methodToEdit.inputNotes?.[index]"
          v-tooltip="methodToEdit.inputNotes[index]"
        >
          <app-icon
            class="contract-editing__input-icon"
            :name="$icons.exclamationCircle"
          />
        </div>
      </div>
    </div>
    <app-button
      class="contract-editing__btn"
      :text="submitButtonName"
      :disabled="!isFieldsValid || !isLoaded"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { ContractEditingType } from '@/types'
import { computed, reactive, ref } from 'vue'
import { InputField } from '@/fields'
import { AppButton, AppIcon } from '@/common'
import {
  useContract,
  useExceptionContractsProvider,
  useFormValidation,
  useI18n,
} from '@/composables'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import {
  CONTRACT_INPUTS,
  CONTRACT_TYPE,
  DISTRIBUTION_CONTRACT_METHODS,
  L1_SENDER_CONTRACT_METHODS,
  L2_MESSAGE_RECEIVER_CONTRACT_METHODS,
  L2_TOKEN_RECEIVER_CONTRACT_METHODS,
  TOKEN_CONTRACT_METHODS,
} from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { useRoute } from 'vue-router'
import { ContractTransaction, utils } from 'ethers'
import { config, getEthereumChainsName } from '@config'
import { CONTRACT_METHODS } from '@/const'

/* eslint-disable @typescript-eslint/ban-ts-comment */

type Input = keyof typeof CONTRACT_INPUTS

type Inputs = {
  [key in `input-${Input}`]?: string
}

const props = defineProps<{
  contractType: CONTRACT_TYPE
  methodToEdit: ContractEditingType
}>()

const { t } = useI18n()
const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const isLoaded = ref(true)

const form = reactive(
  props.methodToEdit?.inputs
    ? props.methodToEdit?.inputs.reduce((acc, item) => {
        acc[`input-${item.id}`] = ''
        return acc
      }, {} as Inputs)
    : {},
)

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  props.methodToEdit.validationRules,
)

const submitButtonName = computed(() =>
  props.methodToEdit.methodName === CONTRACT_METHODS.renounceOwnership
    ? t('contract-editing.renounce-btn')
    : t('contract-editing.submit-btn'),
)

const contract = computed(() => {
  if (!route.query.contractAddress) return null

  /* eslint-disable no-case-declarations */
  switch (props.contractType) {
    case CONTRACT_TYPE.distribution:
      const Distribution__factoryProvider = useExceptionContractsProvider(
        'Distribution__factory',
      )

      return useContract(
        'Distribution__factory',
        String(route.query.contractAddress),
        Distribution__factoryProvider.value,
      )
    case CONTRACT_TYPE.l1Sender:
      const L1Sender__factoryProvider =
        useExceptionContractsProvider('L1Sender__factory')

      return useContract(
        'L1Sender__factory',
        String(route.query.contractAddress),
        L1Sender__factoryProvider.value,
      )
    case CONTRACT_TYPE.l2MessageReceiver:
      const l2MessageReceiverProvider = useExceptionContractsProvider(
        'L2MessageReceiver__factory',
      )

      return useContract(
        'L2MessageReceiver__factory',
        String(route.query.contractAddress),
        l2MessageReceiverProvider.value,
      )
    case CONTRACT_TYPE.l2TokenReceiver:
      const L2TokenReceiver__factoryProvider = useExceptionContractsProvider(
        'L2TokenReceiver__factory',
      )

      return useContract(
        'L2TokenReceiver__factory',
        String(route.query.contractAddress),
        L2TokenReceiver__factoryProvider.value,
      )
    default:
      const MOR20__factoryProvider =
        useExceptionContractsProvider('MOR20__factory')

      return useContract(
        'MOR20__factory',
        String(route.query.contractAddress),
        MOR20__factoryProvider.value,
      )
  }
})

const submitTokenContract = async (): Promise<ContractTransaction | null> => {
  let tx: ContractTransaction | null = null
  if (!contract.value) {
    return null
  }
  switch (props.methodToEdit.methodName) {
    case TOKEN_CONTRACT_METHODS.renounceOwnership:
      tx = await contract.value?.signerBased.value?.renounceOwnership()
      break
    case TOKEN_CONTRACT_METHODS.approve:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.approve(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.transfer:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.transfer(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.mint(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    // @ts-ignore
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      tx = await contract.value?.signerBased.value?.transferOwnership(
        String(form[`input-${CONTRACT_INPUTS.newOwner}`]),
      )
      break
    default:
      return tx
  }
  return tx
}

//TODO: ADD NEW LOGIC AS WE TALKED WITH MARK
const submitDistributionContract = async () => {
  let tx: ContractTransaction | null = null
  switch (props.methodToEdit.methodName) {
    case DISTRIBUTION_CONTRACT_METHODS.createPool:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.createPool([
        form[`input-${CONTRACT_INPUTS.payoutStart}`],
        form[`input-${CONTRACT_INPUTS.decreaseInterval}`],
        form[`input-${CONTRACT_INPUTS.withdrawLockPeriod}`],
        form[`input-${CONTRACT_INPUTS.claimLockPeriod}`],
        form[`input-${CONTRACT_INPUTS.withdrawLockPeriodAfterStake}`],
        form[`input-${CONTRACT_INPUTS.initialReward}`],
        form[`input-${CONTRACT_INPUTS.rewardDecrease}`],
        form[`input-${CONTRACT_INPUTS.minimalStake}`],
        Boolean(Number(form[`input-${CONTRACT_INPUTS.isPublic}`])),
      ])
      break
    case DISTRIBUTION_CONTRACT_METHODS.editPool:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.editPool(
        form[`input-${CONTRACT_INPUTS.poolId}`],
        [
          form[`input-${CONTRACT_INPUTS.payoutStart}`],
          form[`input-${CONTRACT_INPUTS.decreaseInterval}`],
          form[`input-${CONTRACT_INPUTS.withdrawLockPeriod}`],
          form[`input-${CONTRACT_INPUTS.claimLockPeriod}`],
          form[`input-${CONTRACT_INPUTS.withdrawLockPeriodAfterStake}`],
          form[`input-${CONTRACT_INPUTS.initialReward}`],
          form[`input-${CONTRACT_INPUTS.rewardDecrease}`],
          form[`input-${CONTRACT_INPUTS.minimalStake}`],
          Boolean(Number(form[`input-${CONTRACT_INPUTS.isPublic}`])),
        ],
      )
      break
    case DISTRIBUTION_CONTRACT_METHODS.bridgeOverplus:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.bridgeOverplus(
        form[`input-${CONTRACT_INPUTS.gasLimit}`],
        form[`input-${CONTRACT_INPUTS.maxFee}`],
        form[`input-${CONTRACT_INPUTS.submissionCost}`],
        {
          value: form[`input-${CONTRACT_INPUTS.bridgeValue}`],
        },
      )
      break
    case TOKEN_CONTRACT_METHODS.transfer:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.transfer(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.mint(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(String(form[`input-${CONTRACT_INPUTS.amount}`])),
      )
      break
    // @ts-ignore
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.transferOwnership(
        String(form[`input-${CONTRACT_INPUTS.newOwner}`]),
      )
      break
    default:
      return tx
  }
  return tx
}

const submitL1SenderContract = async () => {
  let tx: ContractTransaction | null = null
  switch (props.methodToEdit.methodName) {
    // @ts-ignore
    case L1_SENDER_CONTRACT_METHODS.transferOwnership:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.transferOwnership(
        String(form[`input-${CONTRACT_INPUTS.newOwner}`]),
      )
      break
    case L1_SENDER_CONTRACT_METHODS.setRewardTokenLZParams:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.setRewardTokenLZParams(
        form[`input-${CONTRACT_INPUTS.zroPaymentAddress}`],
        form[`input-${CONTRACT_INPUTS.adapterParams}`],
      )
      break
    default:
      return tx
  }
  return tx
}

const submitL2MessageReceiver = async () => {
  let tx: ContractTransaction | null = null
  switch (props.methodToEdit.methodName) {
    // @ts-ignore
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.transferOwnership:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.transferOwnership(
        String(form[`input-${CONTRACT_INPUTS.newOwner}`]),
      )
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.retryMessage:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.retryMessage(
        form[`input-${CONTRACT_INPUTS.senderChainId}`],
        form[`input-${CONTRACT_INPUTS.senderAndReceiverAddresses}`],
        form[`input-${CONTRACT_INPUTS.nonce}`],
        form[`input-${CONTRACT_INPUTS.payload}`],
      )
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.setLzSender:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.setLzSender(
        form[`input-${CONTRACT_INPUTS.lzSender}`],
      )
      break
    default:
      return tx
  }
  return tx
}

const submitL2TokenReceiver = async () => {
  let tx: ContractTransaction | null = null
  switch (props.methodToEdit.methodName) {
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.transferOwnership:
      // @ts-ignore
      tx = contract.value?.signerBased.value?.transferOwnership(
        String(form[`input-${CONTRACT_INPUTS.newOwner}`]),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.collectFees:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.collectFees(
        form[`input-${CONTRACT_INPUTS.tokenId}`],
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.decreaseLiquidityCurrentRange:
      tx =
        // @ts-ignore
        await contract.value?.signerBased.value?.decreaseLiquidityCurrentRange(
          form[`input-${CONTRACT_INPUTS.tokenId}`],
          form[`input-${CONTRACT_INPUTS.amount0Min}`],
          form[`input-${CONTRACT_INPUTS.amount1Min}`],
          form[`input-${CONTRACT_INPUTS.liquidity}`],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.increaseLiquidityCurrentRange:
      tx =
        // @ts-ignore
        await contract.value?.signerBased.value?.increaseLiquidityCurrentRange(
          form[`input-${CONTRACT_INPUTS.tokenId}`],
          form[`input-${CONTRACT_INPUTS.amount0Add}`],
          form[`input-${CONTRACT_INPUTS.amount1Add}`],
          form[`input-${CONTRACT_INPUTS.amount0Min}`],
          form[`input-${CONTRACT_INPUTS.amount1Min}`],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.swap:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.swap(
        form[`input-${CONTRACT_INPUTS.amountIn}`],
        form[`input-${CONTRACT_INPUTS.amountOutMinimum}`],
        form[`input-${CONTRACT_INPUTS.deadline}`],
        form[`input-${CONTRACT_INPUTS.sqrtPriceLimitX96}`],
        Boolean(Number(form[`input-${CONTRACT_INPUTS.isUseFirstSwapParams}`])),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.editParams:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.editParams(
        [
          form[`input-${CONTRACT_INPUTS.tokenIn}`],
          form[`input-${CONTRACT_INPUTS.tokenOut}`],
          form[`input-${CONTRACT_INPUTS.fee}`],
        ],
        Boolean(Number(form[`input-${CONTRACT_INPUTS.isEditFirstParams}`])),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.withdrawTokenId:
      // @ts-ignore
      tx = await contract.value?.signerBased.value?.withdrawTokenId(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        form[`input-${CONTRACT_INPUTS.token}`],
        form[`input-${CONTRACT_INPUTS.tokenId}`],
      )
      break
    default:
      return tx
  }
  return tx
}

const updateFormField = (id: Input, value: string | number) => {
  form[`input-${id}`] = String(value)
}

const submit = async () => {
  if (!contract.value) {
    return
  }
  isLoaded.value = false
  let tx: ContractTransaction | null = null

  let targetChain = ''

  try {
    switch (props.contractType) {
      case CONTRACT_TYPE.token:
        const MOR20__factoryProvider =
          useExceptionContractsProvider('MOR20__factory')

        targetChain = String(MOR20__factoryProvider.value.network.chainId)

        await web3ProvidersStore.provider.selectChain(targetChain)
        tx = await submitTokenContract()
        break
      case CONTRACT_TYPE.distribution:
        const Distribution__factoryProvider = useExceptionContractsProvider(
          'Distribution__factory',
        )

        targetChain = String(
          Distribution__factoryProvider.value.network.chainId,
        )

        await web3ProvidersStore.provider.selectChain(targetChain)
        tx = await submitDistributionContract()
        break
      case CONTRACT_TYPE.l1Sender:
        const L1Sender__factoryProvider =
          useExceptionContractsProvider('L1Sender__factory')

        targetChain = String(L1Sender__factoryProvider.value.network.chainId)

        await web3ProvidersStore.provider.selectChain(targetChain)
        tx = await submitL1SenderContract()
        break
      case CONTRACT_TYPE.l2MessageReceiver:
        const L2MessageReceiver__factoryProvider =
          useExceptionContractsProvider('L2MessageReceiver__factory')

        targetChain = String(
          L2MessageReceiver__factoryProvider.value.network.chainId,
        )

        await web3ProvidersStore.provider.selectChain(targetChain)
        tx = await submitL2MessageReceiver()
        break
      default:
        const L2TokenProvider = useExceptionContractsProvider('MOR20__factory')

        targetChain = String(L2TokenProvider.value.network.chainId)

        await web3ProvidersStore.provider.selectChain(targetChain)
        tx = await submitL2TokenReceiver()
    }

    const explorerTxUrl = getEthExplorerTxUrl(
      config.chainsMap[getEthereumChainsName(targetChain)]
        .blockExplorerUrls?.[0] ?? '',
      tx?.hash ?? '',
    )
    if (tx && explorerTxUrl) {
      bus.emit(
        BUS_EVENTS.info,
        t('mor20-creation-form.tx-sent-message', { explorerTxUrl }),
      )

      await tx.wait()

      bus.emit(
        BUS_EVENTS.success,
        t('mor20-creation-form.success-message', { explorerTxUrl }),
      )
    }
  } catch (e) {
    ErrorHandler.process(e)
  }
  isLoaded.value = true
}
</script>

<style scoped lang="scss">
.contract-editing {
  width: 100%;
}

.contract-editing__title {
  margin-bottom: toRem(12);
}

.contract-editing__note {
  color: var(--text-tertiary-main);
}

.contract-editing__inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
  margin-top: toRem(24);
}

.contract-editing__btn {
  margin-top: toRem(24);
  margin-left: auto;
}

.contract-editing__input-wrp {
  position: relative;
  display: flex;
  gap: toRem(18);
}

.contract-editing__input-icon {
  position: relative;
  top: toRem(17);
  width: toRem(30);
  height: toRem(30);
  color: var(--text-tertiary-main);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.8;
  }
}
</style>
