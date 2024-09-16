<template>
  <div class="edit-contract">
    <header>
      <contract-info-header
        :name="$t('edit-contract.title')"
        :project-name="contractName"
        :type="CONTRACT_INFO_NAMES.edit"
      />
    </header>
    <div class="edit-contract__content">
      <contract-info-methods
        class="edit-contract__content-methods"
        :methods="contractMethods"
        :chosen-method="chosenMethod"
        @choose-method="updateChosenMethod"
      />
      <contract-edition
        class="edit-contract__content-edit"
        :key="methodsToEdit[chosenMethod]"
        :contract-type="contractType"
        :method-to-edit="methodsToEdit[chosenMethod]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTRACT_INFO_NAMES, CONTRACT_TYPE } from '@/enums'
import { computed, ref, watch } from 'vue'
import { ContractInfoHeader, ContractInfoMethods } from './ContractInfo'
import ContractEdition from './ContractEdition.vue'
import { address, minValue, required } from '@/validators'
import { ContractEditionType, ContractMethods } from '@/types'
import { useI18n } from '@/composables'
import { CONTRACT_METHODS } from '@/const'
import { maxValue } from '@vuelidate/validators'

type ContractMethodsConfig = {
  [key in keyof typeof CONTRACT_METHODS]: ContractEditionType
}

const props = defineProps<{
  contractType: CONTRACT_TYPE
  network: string
  projectName?: string
}>()

const { t } = useI18n()

const chosenMethod = ref(CONTRACT_METHODS.mint)

const contractMethods = computed(() => {
  switch (props.contractType) {
    case CONTRACT_TYPE.token:
      return [
        CONTRACT_METHODS.mint,
        CONTRACT_METHODS.transfer,
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.increaseAllowance,
        CONTRACT_METHODS.burn,
        CONTRACT_METHODS.approve,
      ]
    case CONTRACT_TYPE.distribution:
      return [CONTRACT_METHODS.bridgeOverplus, CONTRACT_METHODS.createPool]
    case CONTRACT_TYPE.l1Sender:
      return [
        CONTRACT_METHODS.sendDepositToken,
        CONTRACT_METHODS.sendMintMessage,
        CONTRACT_METHODS.transferOwnership,
      ]
    case CONTRACT_TYPE.l2MessageReceiver:
      return [CONTRACT_METHODS.transferOwnership]
    case CONTRACT_TYPE.l2TokenReceiver:
      return [
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.collectFees,
        CONTRACT_METHODS.decreaseLiquidityCurrentRange,
        CONTRACT_METHODS.increaseLiquidityCurrentRange,
        CONTRACT_METHODS.withdrawToken,
        CONTRACT_METHODS.withdrawTokenId,
      ]
    default:
      return []
  }
})

const contractName = computed(() => {
  if (props.projectName) {
    return props.projectName
  }
  return props.contractType
})

const methodsToEdit = computed<ContractMethodsConfig>(() => ({
  [CONTRACT_METHODS.approve]: {
    methodName: CONTRACT_METHODS.approve,
    note: t('edit-contract.approve.note'),
    inputs: [
      t('edit-contract.approve.spender-lbl'),
      t('edit-contract.approve.amount-lbl'),
    ],
    inputNotes: [
      t('edit-contract.approve.spender-note'),
      t('edit-contract.approve.amount-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transfer]: {
    methodName: CONTRACT_METHODS.transfer,
    note: t('edit-contract.transfer.note'),
    inputs: [
      t('edit-contract.transfer.to-lbl'),
      t('edit-contract.transfer.amount-lbl'),
    ],
    inputNotes: [
      t('edit-contract.transfer.to-note'),
      t('edit-contract.transfer.amount-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.mint]: {
    methodName: CONTRACT_METHODS.mint,
    note: t('edit-contract.mint.note'),
    inputs: [
      t('edit-contract.mint.to-lbl'),
      t('edit-contract.mint.amount-lbl'),
    ],
    inputNotes: [
      t('edit-contract.mint.to-note'),
      t('edit-contract.mint.amount-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.burn]: {
    methodName: CONTRACT_METHODS.burn,
    note: t('edit-contract.burn.note'),
    inputs: [t('edit-contract.burn.amount-lbl')],
    inputNotes: [t('edit-contract.burn.amount-note')],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseAllowance]: {
    methodName: CONTRACT_METHODS.increaseAllowance,
    note: t('edit-contract.increaseAllowance.note'),
    inputs: [
      t('edit-contract.increaseAllowance.spender-lbl'),
      t('edit-contract.increaseAllowance.amount-lbl'),
    ],
    inputNotes: [
      t('edit-contract.increaseAllowance.spender-note'),
      t('edit-contract.increaseAllowance.amount-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transferOwnership]: {
    methodName: CONTRACT_METHODS.transferOwnership,
    note: t('edit-contract.transferOwnership.note'),
    inputs: [t('edit-contract.transferOwnership.new-owner-lbl')],
    inputNotes: [t('edit-contract.transferOwnership.new-owner-note')],
    validationRules: {
      'input-0': {
        required,
        address,
      },
    },
  },
  [CONTRACT_METHODS.bridgeOverplus]: {
    methodName: CONTRACT_METHODS.bridgeOverplus,
    note: t('edit-contract.bridge-overplus.note'),
    inputs: [
      t('edit-contract.bridge-overplus.gasLimit-lbl'),
      t('edit-contract.bridge-overplus.maxFee-lbl'),
      t('edit-contract.bridge-overplus.submissionCost-lbl'),
      t('edit-contract.bridge-overplus.bridge-value-lbl'),
    ],
    inputNotes: [
      t('edit-contract.bridge-overplus.gasLimit-note'),
      t('edit-contract.bridge-overplus.maxFee-note'),
      t('edit-contract.bridge-overplus.submissionCost-note'),
      t('edit-contract.bridge-overplus.bridge-value-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.createPool]: {
    methodName: CONTRACT_METHODS.createPool,
    note: t('edit-contract.createPool.note'),
    inputs: [
      t('edit-contract.createPool.payoutStart-lbl'),
      t('edit-contract.createPool.decreaseInterval-lbl'),
      t('edit-contract.createPool.withdrawLockPeriod-lbl'),
      t('edit-contract.createPool.claimLockPeriod-lbl'),
      t('edit-contract.createPool.withdrawLockPeriodAfterStake-lbl'),
      t('edit-contract.createPool.initialReward-lbl'),
      t('edit-contract.createPool.rewardDecrease-lbl'),
      t('edit-contract.createPool.minimalStake-lbl'),
      t('edit-contract.createPool.isPublic-lbl'),
    ],
    inputNotes: [
      t('edit-contract.createPool.payoutStart-note'),
      t('edit-contract.createPool.decreaseInterval-note'),
      t('edit-contract.createPool.withdrawLockPeriod-note'),
      t('edit-contract.createPool.claimLockPeriod-note'),
      t('edit-contract.createPool.withdrawLockPeriodAfterStake-note'),
      t('edit-contract.createPool.initialReward-note'),
      t('edit-contract.createPool.rewardDecrease-note'),
      t('edit-contract.createPool.minimalStake-note'),
      t('edit-contract.createPool.isPublic-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        minValue: minValue(0),
      },
      'input-4': {
        required,
        minValue: minValue(0),
      },
      'input-5': {
        required,
        minValue: minValue(0),
      },
      'input-6': {
        required,
        minValue: minValue(0),
      },
      'input-7': {
        required,
        minValue: minValue(0),
      },
      'input-8': {
        required,
        minValue: minValue(0),
        maxValue: maxValue(1),
      },
    },
  },
  [CONTRACT_METHODS.manageUsersInPrivatePool]: {
    methodName: CONTRACT_METHODS.manageUsersInPrivatePool,
    note: t('edit-contract.manage-users-in-private-pool.note'),
    inputs: [
      t('edit-contract.manage-users-in-private-pool.poolId-lbl'),
      t('edit-contract.manage-users-in-private-pool.users-lbl'),
      t('edit-contract.manage-users-in-private-pool.amounts-lbl'),
    ],
    inputNotes: [
      t('edit-contract.manage-users-in-private-pool.poolId-note'),
      t('edit-contract.manage-users-in-private-pool.users-note'),
      t('edit-contract.manage-users-in-private-pool.amounts-note'),
    ],
    validationRules: {
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        // type: 'array',
      },
      'input-3': {
        required,
        // type: 'array',
      },
    },
  },
  [CONTRACT_METHODS.sendDepositToken]: {
    methodName: CONTRACT_METHODS.sendDepositToken,
    note: t('edit-contract.sendDepositToken.note'),
    inputs: [
      t('edit-contract.sendDepositToken.eth-value-lbl'),
      t('edit-contract.sendDepositToken.gasLimit-lbl'),
      t('edit-contract.sendDepositToken.maxFeePerGas-lbl'),
      t('edit-contract.sendDepositToken.maxSubmissionCost-lbl'),
    ],
    inputNotes: [
      t('edit-contract.sendDepositToken.eth-value-note'),
      t('edit-contract.sendDepositToken.gasLimit-note'),
      t('edit-contract.sendDepositToken.maxFeePerGas-note'),
      t('edit-contract.sendDepositToken.maxSubmissionCost-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.sendMintMessage]: {
    methodName: CONTRACT_METHODS.sendMintMessage,
    note: t('edit-contract.sendMintMessage.note'),
    inputs: [
      t('edit-contract.sendMintMessage.eth-amount-lbl'),
      t('edit-contract.sendMintMessage.user-lbl'),
      t('edit-contract.sendMintMessage.amount-lbl'),
      t('edit-contract.sendMintMessage.refundTo-lbl'),
    ],
    inputNotes: [
      t('edit-contract.sendMintMessage.eth-amount-note'),
      t('edit-contract.sendMintMessage.user-note'),
      t('edit-contract.sendMintMessage.amount-note'),
      t('edit-contract.sendMintMessage.refundTo-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        address,
      },
      'input-2': {
        minValue: minValue(0),
      },
      'input-3': {
        address,
      },
    },
  },
  [CONTRACT_METHODS.collectFees]: {
    methodName: CONTRACT_METHODS.collectFees,
    note: t('edit-contract.collectFees.note'),
    inputs: [t('edit-contract.collectFees.tokenId-lbl')],
    inputNotes: [t('edit-contract.collectFees.tokenId-note')],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.decreaseLiquidityCurrentRange]: {
    methodName: CONTRACT_METHODS.decreaseLiquidityCurrentRange,
    note: t('edit-contract.decreaseLiquidityCurrentRange.note'),
    inputs: [
      t('edit-contract.decreaseLiquidityCurrentRange.tokenId-lbl'),
      t('edit-contract.decreaseLiquidityCurrentRange.liquidity-lbl'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount0Min-lbl'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount1Min-lbl'),
    ],
    inputNotes: [
      t('edit-contract.decreaseLiquidityCurrentRange.tokenId-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.liquidity-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount0Min-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseLiquidityCurrentRange]: {
    methodName: CONTRACT_METHODS.increaseLiquidityCurrentRange,
    note: t('edit-contract.increaseLiquidityCurrentRange.note'),
    inputs: [
      t('edit-contract.increaseLiquidityCurrentRange.tokenId-lbl'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Add-lbl'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Add-lbl'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Min-lbl'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Min-lbl'),
    ],
    inputNotes: [
      t('edit-contract.increaseLiquidityCurrentRange.tokenId-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Add-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Add-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Min-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(0),
      },
      'input-1': {
        required,
        minValue: minValue(0),
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        minValue: minValue(0),
      },
      'input-4': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.withdrawToken]: {
    methodName: CONTRACT_METHODS.withdrawToken,
    note: t('edit-contract.withdrawToken.note'),
    inputs: [
      t('edit-contract.withdrawToken.recipient-lbl'),
      t('edit-contract.withdrawToken.token-lbl'),
      t('edit-contract.withdrawToken.amount-lbl'),
    ],
    inputNotes: [
      t('edit-contract.withdrawToken.recipient-note'),
      t('edit-contract.withdrawToken.token-note'),
      t('edit-contract.withdrawToken.amount-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        address,
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.withdrawTokenId]: {
    methodName: CONTRACT_METHODS.withdrawTokenId,
    note: t('edit-contract.withdrawTokenId.note'),
    inputs: [
      t('edit-contract.withdrawTokenId.recipient-lbl'),
      t('edit-contract.withdrawTokenId.token-lbl'),
      t('edit-contract.withdrawTokenId.tokenId-lbl'),
    ],
    inputNotes: [
      t('edit-contract.withdrawTokenId.recipient-note'),
      t('edit-contract.withdrawTokenId.token-note'),
      t('edit-contract.withdrawTokenId.tokenId-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        address,
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
    },
  },
}))

const updateChosenMethod = (method: ContractMethods) => {
  chosenMethod.value = method
}

watch(
  contractMethods,
  () => {
    chosenMethod.value = contractMethods.value[0]
  },
  { deep: true, immediate: true },
)
</script>

<style scoped lang="scss">
.edit-contract {
  @include contract-info;
}

.distribution-contract-info__data {
  margin-top: toRem(10);
}

.distribution-contract-info__system-message {
  @include system-message;
}

.edit-contract__name {
  display: flex;
  gap: toRem(8);
  align-items: center;

  @include respond-to(tablet) {
    flex-direction: column;
    align-items: center;
  }
}

.edit-contract__project {
  font-size: toRem(22);
  line-height: toRem(32);
  font-weight: 400;

  @include respond-to(tablet) {
    margin-top: toRem(20);
    font-size: toRem(20);
    text-align: center;
  }
}

.edit-contract__content {
  display: flex;
  padding-top: toRem(40);

  @include respond-to(medium) {
    flex-direction: column;
    gap: toRem(40);
  }
}

.edit-contract__content-methods {
  max-width: toRem(320);
  border-right: toRem(1) solid var(--border-primary-dark);

  @include respond-to(medium) {
    max-width: 100%;
    border: none;
  }
}

.edit-contract__content-edit {
  margin: 0 auto;
  max-width: toRem(560);
  padding-left: toRem(40);

  @include respond-to(medium) {
    max-width: 100%;
    padding: 0;
  }
}
</style>
