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
          v-model="form[`input-${id}`]"
          class="contract-editing__input"
          :placeholder="displayedName"
          :error-message="getFieldErrorMessage(`input-${id}`)"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField(`input-${id}`)"
        />
        <div
          v-if="methodToEdit.inputNotes[index]"
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
import { useContract, useFormValidation, useI18n } from '@/composables'
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
import { ContractTransaction, providers, utils } from 'ethers'
import { config, EthereumChains, NetworkTypes } from '@config'
import { CONTRACT_METHODS } from '@/const'

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
      }, {})
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

const ethProvider = computed(() => {
  if (
    web3ProvidersStore.provider.rawProvider &&
    web3ProvidersStore.provider.chainId === config.chainsMap.Ethereum.chainId
  ) {
    return new providers.Web3Provider(
      web3ProvidersStore.provider.rawProvider as providers.ExternalProvider,
    )
  }

  return config.perChainFallbackProviders[EthereumChains.Ethereum]
})

const arbProvider = computed(() => {
  if (
    web3ProvidersStore.provider.rawProvider &&
    web3ProvidersStore.provider.chainId === config.chainsMap.Arbitrum.chainId
  ) {
    return new providers.Web3Provider(
      web3ProvidersStore.provider.rawProvider as providers.ExternalProvider,
    )
  }

  return config.perChainFallbackProviders[EthereumChains.Arbitrum]
})

const contract = computed(() => {
  if (!route.query.contractAddress) return null

  switch (props.contractType) {
    case CONTRACT_TYPE.distribution:
      return useContract(
        'Distribution__factory',
        String(route.query.contractAddress),
        ethProvider.value,
      )
    case CONTRACT_TYPE.l1Sender:
      return useContract(
        'L1Sender__factory',
        String(route.query.contractAddress),
        ethProvider.value,
      )
    case CONTRACT_TYPE.l2MessageReceiver:
      return useContract(
        'L2MessageReceiver__factory',
        String(route.query.contractAddress),
        arbProvider.value,
      )
    case CONTRACT_TYPE.l2TokenReceiver:
      return useContract(
        'L2TokenReceiver__factory',
        String(route.query.contractAddress),
        arbProvider.value,
      )
    default:
      return useContract(
        'MOR20__factory',
        String(route.query.contractAddress),
        arbProvider.value,
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
      tx = await contract.value?.signerBased.value?.approve(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.transfer:
      tx = await contract.value?.signerBased.value?.transfer(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      tx = await contract.value?.signerBased.value?.mint(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      tx = await contract.value?.signerBased.value?.transferOwnership(
        form[`input-${CONTRACT_INPUTS.newOwner}`],
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
      tx = await contract.value?.signerBased.value?.transfer(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      tx = await contract.value?.signerBased.value?.mint(
        form[`input-${CONTRACT_INPUTS.recipient}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form[`input-${CONTRACT_INPUTS.spender}`],
        utils.parseEther(form[`input-${CONTRACT_INPUTS.amount}`]),
      )
      break
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      tx = await contract.value?.signerBased.value?.transferOwnership(
        form[`input-${CONTRACT_INPUTS.newOwner}`],
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
    case L1_SENDER_CONTRACT_METHODS.transferOwnership:
      tx = contract.value?.signerBased.value?.transferOwnership(
        form[`input-${CONTRACT_INPUTS.newOwner}`],
      )
      break
    case L1_SENDER_CONTRACT_METHODS.setRewardTokenLZParams:
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
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.transferOwnership:
      tx = contract.value?.signerBased.value?.transferOwnership(
        form[`input-${CONTRACT_INPUTS.newOwner}`],
      )
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.retryMessage:
      tx = contract.value?.signerBased.value?.retryMessage(
        form[`input-${CONTRACT_INPUTS.senderChainId}`],
        form[`input-${CONTRACT_INPUTS.senderAndReceiverAddresses}`],
        form[`input-${CONTRACT_INPUTS.nonce}`],
        form[`input-${CONTRACT_INPUTS.payload}`],
      )
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.setLzSender:
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
      tx = contract.value?.signerBased.value?.transferOwnership(
        form[`input-${CONTRACT_INPUTS.newOwner}`],
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.collectFees:
      tx = await contract.value?.signerBased.value?.collectFees(
        form[`input-${CONTRACT_INPUTS.tokenId}`],
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.decreaseLiquidityCurrentRange:
      tx =
        await contract.value?.signerBased.value?.decreaseLiquidityCurrentRange(
          form[`input-${CONTRACT_INPUTS.tokenId}`],
          form[`input-${CONTRACT_INPUTS.amount0Min}`],
          form[`input-${CONTRACT_INPUTS.amount1Min}`],
          form[`input-${CONTRACT_INPUTS.liquidity}`],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.increaseLiquidityCurrentRange:
      tx =
        await contract.value?.signerBased.value?.increaseLiquidityCurrentRange(
          form[`input-${CONTRACT_INPUTS.tokenId}`],
          form[`input-${CONTRACT_INPUTS.amount0Add}`],
          form[`input-${CONTRACT_INPUTS.amount1Add}`],
          form[`input-${CONTRACT_INPUTS.amount0Min}`],
          form[`input-${CONTRACT_INPUTS.amount1Min}`],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.swap:
      tx = await contract.value?.signerBased.value?.swap(
        form[`input-${CONTRACT_INPUTS.amountIn}`],
        form[`input-${CONTRACT_INPUTS.amountOutMinimum}`],
        form[`input-${CONTRACT_INPUTS.deadline}`],
        form[`input-${CONTRACT_INPUTS.sqrtPriceLimitX96}`],
        Boolean(Number(form[`input-${CONTRACT_INPUTS.isUseFirstSwapParams}`])),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.editParams:
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

const submit = async () => {
  if (!contract.value) {
    return
  }
  isLoaded.value = false
  let tx: ContractTransaction | null = null
  let isL1 = false
  const isMainnet = route.query.network === NetworkTypes.Mainnet
  try {
    switch (props.contractType) {
      case CONTRACT_TYPE.token:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? config.chainsMap.Arbitrum.chainId
            : config.chainsMap.ArbitrumSepolia.chainId,
        )
        tx = await submitTokenContract()
        break
      case CONTRACT_TYPE.distribution:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? config.chainsMap.Ethereum.chainId
            : config.chainsMap.Sepolia.chainId,
        )
        tx = await submitDistributionContract()
        isL1 = true
        break
      case CONTRACT_TYPE.l1Sender:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? config.chainsMap.Ethereum.chainId
            : config.chainsMap.Sepolia.chainId,
        )
        tx = await submitL1SenderContract()
        isL1 = true
        break
      case CONTRACT_TYPE.l2MessageReceiver:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? config.chainsMap.Arbitrum.chainId
            : config.chainsMap.ArbitrumSepolia.chainId,
        )
        tx = await submitL2MessageReceiver()
        break
      default:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? config.chainsMap.Arbitrum.chainId
            : config.chainsMap.ArbitrumSepolia.chainId,
        )
        tx = await submitL2TokenReceiver()
    }
    const explorerTxUrl = getEthExplorerTxUrl(
      web3ProvidersStore.selectedNetworkByType[isL1 ? 'l1' : 'l2'].explorerUrl,
      tx.hash,
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
