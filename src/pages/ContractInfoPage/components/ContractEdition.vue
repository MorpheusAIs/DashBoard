<template>
  <div class="contract-edition">
    <h4 class="contract-edition__title">
      {{ $t('contract-edition.title') }}
    </h4>
    <span class="contract-edition__note">
      {{ methodToEdit.note }}
    </span>
    <div class="contract-edition__inputs">
      <div
        v-for="(input, index) in methodToEdit.inputs"
        :key="index"
        class="contract-edition__input-wrp"
      >
        <input-field
          v-model="form[`input-${index}`]"
          class="contract-edition__input"
          :placeholder="input"
          :error-message="getFieldErrorMessage(`input-${index}`)"
          :disabled="isSubmitting || isSubmitted"
          @blur="touchField(`input-${index}`)"
        />
        <div
          v-if="methodToEdit.inputNotes[index]"
          v-tooltip="methodToEdit.inputNotes[index]"
        >
          <app-icon
            class="contract-edition__input-icon"
            :name="$icons.exclamationCircle"
          />
        </div>
      </div>
    </div>
    <app-button
      class="contract-edition__btn"
      :text="$t('contract-edition.submit-btn')"
      :disabled="!isFieldsValid || isSubmitting"
      @click="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { ContractEditionType } from '@/types'
import { computed, reactive, ref } from 'vue'
import { InputField } from '@/fields'
import { AppButton, AppIcon } from '@/common'
import { useContract, useFormValidation } from '@/composables'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import {
  CONTRACT_TYPE,
  DISTRIBUTION_CONTRACT_METHODS,
  ETHEREUM_CHAIN_IDS,
  ETHEREUM_CHAIN_NAMES,
  L1_SENDER_CONTRACT_METHODS,
  L2_MESSAGE_RECEIVER_CONTRACT_METHODS,
  L2_TOKEN_RECEIVER_CONTRACT_METHODS,
  NETWORK_IDS,
  TOKEN_CONTRACT_METHODS,
} from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { useRoute } from 'vue-router'
import { ContractTransaction, utils } from 'ethers'
import { config } from '@config'

type ContractInfo = {
  contractName: string
  network: keyof typeof ETHEREUM_CHAIN_NAMES
}

const props = defineProps<{
  contractType: CONTRACT_TYPE
  methodToEdit: ContractEditionType
}>()

const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const form = reactive(
  props.methodToEdit.inputs.reduce((acc, _, idx) => {
    acc[`input-${idx}`] = ''
    return acc
  }, {}),
)

const { getFieldErrorMessage, touchField, isFieldsValid } = useFormValidation(
  form,
  props.methodToEdit.validationRules,
)

const contract = computed(() => {
  if (!route.query.contractAddress) return null
  const contractInfo: ContractInfo = {
    contractName: '',
    network: ETHEREUM_CHAIN_NAMES.arbitrum,
  }
  switch (props.contractType) {
    case CONTRACT_TYPE.distribution:
      contractInfo.contractName = 'Distribution__factory'
      contractInfo.network = ETHEREUM_CHAIN_NAMES.ethereum
      break
    case CONTRACT_TYPE.l1Sender:
      contractInfo.contractName = 'L1Sender__factory'
      contractInfo.network = ETHEREUM_CHAIN_NAMES.ethereum
      break
    case CONTRACT_TYPE.l2MessageReceiver:
      contractInfo.contractName = 'L2MessageReceiver__factory'
      break
    case CONTRACT_TYPE.l2TokenReceiver:
      contractInfo.contractName = 'L2TokenReceiver__factory'
      break
    default:
      contractInfo.contractName = 'MOR20__factory'
  }
  return useContract(
    contractInfo.contractName,
    route.query.contractAddress,
    contractInfo.network === ETHEREUM_CHAIN_NAMES.ethereum
      ? web3ProvidersStore.l1Provider
      : web3ProvidersStore.l2Provider,
  )
})

const submitTokenContract = async (): Promise<ContractTransaction | null> => {
  let tx: ContractTransaction | null = null
  if (!contract.value) {
    return
  }
  switch (props.methodToEdit.methodName) {
    case TOKEN_CONTRACT_METHODS.approve:
      tx = await contract.value?.signerBased.value?.approve(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.transfer:
      tx = await contract.value?.signerBased.value?.transfer(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(form['input-0']),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      tx = await contract.value?.signerBased.value?.mint(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      tx = await contract.value?.signerBased.value?.transferOwnership(
        form['input-0'],
      )
      break
    default:
      return tx
  }
  return tx
}

const submitDistributionContract = async () => {
  let tx: ContractTransaction | null = null
  switch (props.methodToEdit.methodName) {
    case DISTRIBUTION_CONTRACT_METHODS.editPool:
      tx = await contract.value?.signerBased.value?.editPool(form['input-0'], [
        form['input-1'],
        form['input-2'],
        form['input-3'],
        form['input-4'],
        form['input-5'],
        form['input-6'],
        form['input-7'],
        form['input-8'],
        Boolean(Number(form['input-9'])),
      ])
      break
    case DISTRIBUTION_CONTRACT_METHODS.bridgeOverplus:
      tx = await contract.value?.signerBased.value?.bridgeOverplus(
        form['input-0'],
        utils.parseEther(form['input-1']),
        {
          value: form['input-0'],
        },
      )
      break
    case TOKEN_CONTRACT_METHODS.transfer:
      tx = await contract.value?.signerBased.value?.transfer(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.burn:
      tx = await contract.value?.signerBased.value?.burn(
        utils.parseEther(form['input-0']),
      )
      break
    case TOKEN_CONTRACT_METHODS.mint:
      tx = await contract.value?.signerBased.value?.mint(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.increaseAllowance:
      tx = await contract.value?.signerBased.value?.increaseAllowance(
        form['input-0'],
        utils.parseEther(form['input-1']),
      )
      break
    case TOKEN_CONTRACT_METHODS.transferOwnership:
      tx = await contract.value?.signerBased.value?.transferOwnership(
        form['input-0'],
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
      tx = contract.value?.signerBased.value?.transferOwnership(form['input-0'])
      break
    case L1_SENDER_CONTRACT_METHODS.setRewardTokenLZParams:
      tx = contract.value?.signerBased.value?.setRewardTokenLZParams(
        form['input-0'],
        form['input-1'],
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
      tx = contract.value?.signerBased.value?.transferOwnership(form['input-0'])
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.retryMessage:
      tx = contract.value?.signerBased.value?.retryMessage(
        form['input-0'],
        form['input-1'],
        form['input-2'],
        form['input-3'],
      )
      break
    case L2_MESSAGE_RECEIVER_CONTRACT_METHODS.setLzSender:
      tx = contract.value?.signerBased.value?.setLzSender(form['input-0'])
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
      tx = contract.value?.signerBased.value?.transferOwnership(form['input-0'])
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.collectFees:
      tx = await contract.value?.signerBased.value?.collectFees(form['input-0'])
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.decreaseLiquidityCurrentRange:
      tx =
        await contract.value?.signerBased.value?.decreaseLiquidityCurrentRange(
          form['input-0'],
          form['input-1'],
          form['input-2'],
          form['input-3'],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.increaseLiquidityCurrentRange:
      tx =
        await contract.value?.signerBased.value?.decreaseLiquidityCurrentRange(
          form['input-0'],
          form['input-1'],
          form['input-2'],
          form['input-3'],
          form['input-4'],
        )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.swap:
      tx = await contract.value?.signerBased.value?.swap(
        form['input-0'],
        form['input-1'],
        form['input-2'],
        form['input-3'],
        Boolean(Number(form['input-4'])),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.editParams:
      tx = await contract.value?.signerBased.value?.editParams(
        [form['input-0'], form['input-1'], form['input-2']],
        Boolean(Number(form['input-3'])),
      )
      break
    case L2_TOKEN_RECEIVER_CONTRACT_METHODS.withdrawTokenId:
      tx = await contract.value?.signerBased.value?.withdrawTokenId(
        form['input-0'],
        form['input-1'],
        form['input-2'],
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
  isSubmitted.value = false
  isSubmitting.value = true
  let tx: ContractTransaction | null = null
  let isL1 = false
  const isMainnet = route.query.network === NETWORK_IDS.mainnet
  try {
    switch (props.contractType) {
      case CONTRACT_TYPE.token:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? ETHEREUM_CHAIN_IDS.arbitrum
            : ETHEREUM_CHAIN_IDS.arbitrumSepolia,
        )
        tx = await submitTokenContract()
        break
      case CONTRACT_TYPE.distribution:
        await web3ProvidersStore.provider.selectChain(
          isMainnet ? ETHEREUM_CHAIN_IDS.ethereum : ETHEREUM_CHAIN_IDS.sepolia,
        )
        tx = await submitDistributionContract()
        isL1 = true
        break
      case CONTRACT_TYPE.l1Sender:
        await web3ProvidersStore.provider.selectChain(
          isMainnet ? ETHEREUM_CHAIN_IDS.ethereum : ETHEREUM_CHAIN_IDS.sepolia,
        )
        tx = await submitL1SenderContract()
        isL1 = true
        break
      case CONTRACT_TYPE.l2MessageReceiver:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? ETHEREUM_CHAIN_IDS.arbitrum
            : ETHEREUM_CHAIN_IDS.arbitrumSepolia,
        )
        tx = await submitL2MessageReceiver()
        break
      default:
        await web3ProvidersStore.provider.selectChain(
          isMainnet
            ? ETHEREUM_CHAIN_IDS.arbitrum
            : ETHEREUM_CHAIN_IDS.arbitrumSepolia,
        )
        tx = await submitL2TokenReceiver()
    }
    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[web3ProvidersStore.networkId][isL1 ? 'l1' : 'l2']
        .explorerUrl,
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
    isSubmitted.value = true
  } catch (e) {
    ErrorHandler.process(e)
  }
  isSubmitting.value = false
}
</script>

<style scoped lang="scss">
.contract-edition {
  width: 100%;
}

.contract-edition__title {
  margin-bottom: toRem(12);
}

.contract-edition__note {
  color: var(--text-tertiary-main);
}

.contract-edition__inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(32);
  margin-top: toRem(24);
}

.contract-edition__btn {
  margin-top: toRem(24);
  margin-left: auto;
}

.contract-edition__input-wrp {
  position: relative;
  display: flex;
  gap: toRem(18);
}

.contract-edition__input-icon {
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
