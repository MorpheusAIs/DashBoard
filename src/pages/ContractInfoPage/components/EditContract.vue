<template>
  <div class="edit-contract">
    <header>
      <contract-info-header
        :name="$t('edit-contract.title')"
        :project-name="contractName"
        :type="CONTRACT_INFO_ACTIONS.edit"
      />
    </header>
    <div class="edit-contract__content">
      <contract-info-methods
        class="edit-contract__content-methods"
        :methods="contractMethods"
        :chosen-method="chosenMethod"
        @choose-method="updateChosenMethod"
      />
      <div class="edit-contract__content-edit-wrp">
        <contract-edition
          class="edit-contract__content-edit"
          :key="methodsToEdit[chosenMethod]"
          :contract-type="contractType"
          :method-to-edit="methodsToEdit[chosenMethod]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTRACT_INFO_ACTIONS, CONTRACT_TYPE } from '@/enums'
import { computed, ref, watch } from 'vue'
import { ContractInfoHeader, ContractInfoMethods } from './ContractInfo'
import ContractEdition from './ContractEdition.vue'
import { address, minValue, maxValue, required, hex } from '@/validators'
import { ContractEditionType, ContractMethods } from '@/types'
import { useI18n } from '@/composables'
import { CONTRACT_METHODS } from '@/const'

type ContractMethodsConfig = {
  [key in keyof typeof CONTRACT_METHODS]: ContractEditionType
}

const props = defineProps<{
  contractType: CONTRACT_TYPE
  network: string
  projectName?: string
}>()

const { t } = useI18n()

const chosenMethod = ref(CONTRACT_METHODS.transfer)

const contractMethods = computed(() => {
  switch (props.contractType) {
    case CONTRACT_TYPE.token:
      return [
        CONTRACT_METHODS.approve,
        CONTRACT_METHODS.burn,
        CONTRACT_METHODS.increaseAllowance,
        CONTRACT_METHODS.transfer,
        CONTRACT_METHODS.transferOwnership,
      ]
    case CONTRACT_TYPE.distribution:
      return [
        CONTRACT_METHODS.bridgeOverplus,
        CONTRACT_METHODS.createPool,
        CONTRACT_METHODS.editPool,
        CONTRACT_METHODS.transferOwnership,
        // TODO: THINK ABOUT ARRAY VALIDATION
        // CONTRACT_METHODS.manageUsersInPrivatePool,
      ]
    case CONTRACT_TYPE.l1Sender:
      return [
        CONTRACT_METHODS.setRewardTokenLZParams,
        CONTRACT_METHODS.transferOwnership,
      ]
    case CONTRACT_TYPE.l2MessageReceiver:
      return [
        CONTRACT_METHODS.retryMessage,
        CONTRACT_METHODS.setLzSender,
        CONTRACT_METHODS.transferOwnership,
      ]
    case CONTRACT_TYPE.l2TokenReceiver:
      return [
        CONTRACT_METHODS.collectFees,
        CONTRACT_METHODS.decreaseLiquidityCurrentRange,
        CONTRACT_METHODS.editParams,
        CONTRACT_METHODS.increaseLiquidityCurrentRange,
        CONTRACT_METHODS.swap,
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.withdrawTokenId,
      ]
    default:
      return []
  }
})

const contractName = computed(
  () => `${props.projectName} ${props.contractType}`,
)

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
  // TODO: THINK ABOUT ARRAY VALIDATION
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
  [CONTRACT_METHODS.swap]: {
    methodName: CONTRACT_METHODS.swap,
    note: t('edit-contract.swap.note'),
    inputs: [
      t('edit-contract.swap.amountIn-lbl'),
      t('edit-contract.swap.amountOutMinimum-lbl'),
      t('edit-contract.swap.deadline-lbl'),
      t('edit-contract.swap.sqrtPriceLimitX96-lbl'),
      t('edit-contract.swap.isUseFirstSwapParams-lbl'),
    ],
    inputNotes: [
      t('edit-contract.swap.amountIn-note'),
      t('edit-contract.swap.amountOutMinimum-note'),
      t('edit-contract.swap.deadline-note'),
      t('edit-contract.swap.sqrtPriceLimitX96-note'),
      t('edit-contract.swap.isUseFirstSwapParams-note'),
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
        maxValue: minValue(1),
      },
    },
  },
  [CONTRACT_METHODS.editParams]: {
    methodName: CONTRACT_METHODS.editParams,
    note: t('edit-contract.editParams.note'),
    inputs: [
      t('edit-contract.editParams.tokenIn-lbl'),
      t('edit-contract.editParams.tokenOut-lbl'),
      t('edit-contract.editParams.fee-lbl'),
      t('edit-contract.editParams.isEditFirstParams-lbl'),
    ],
    inputNotes: [
      t('edit-contract.editParams.tokenIn-note'),
      t('edit-contract.editParams.tokenOut-note'),
      t('edit-contract.editParams.fee-note'),
      t('edit-contract.editParams.isEditFirstParams-note'),
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
      'input-3': {
        required,
        minValue: minValue(0),
        maxValue: minValue(1),
      },
    },
  },
  [CONTRACT_METHODS.retryMessage]: {
    methodName: CONTRACT_METHODS.retryMessage,
    note: t('edit-contract.retryMessage.note'),
    inputs: [
      t('edit-contract.retryMessage.senderChainId-lbl'),
      t('edit-contract.retryMessage.senderAndReceiverAddresses-lbl'),
      t('edit-contract.retryMessage.nonce-lbl'),
      t('edit-contract.retryMessage.payload-lbl'),
    ],
    inputNotes: [
      t('edit-contract.retryMessage.senderChainId-note'),
      t('edit-contract.retryMessage.senderAndReceiverAddresses-note'),
      t('edit-contract.retryMessage.nonce-note'),
      t('edit-contract.retryMessage.payload-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        minValue: minValue(1),
      },
      'input-1': {
        required,
        hex,
      },
      'input-2': {
        required,
        minValue: minValue(0),
      },
      'input-3': {
        required,
        hex,
      },
    },
  },
  [CONTRACT_METHODS.setLzSender]: {
    methodName: CONTRACT_METHODS.setLzSender,
    note: t('edit-contract.setLzSender.note'),
    inputs: [t('edit-contract.setLzSender.lzSender-lbl')],
    inputNotes: [t('edit-contract.setLzSender.lzSender-note')],
    validationRules: {
      'input-0': {
        required,
        address,
      },
    },
  },
  [CONTRACT_METHODS.setRewardTokenLZParams]: {
    methodName: CONTRACT_METHODS.setRewardTokenLZParams,
    note: t('edit-contract.setRewardTokenLZParams.note'),
    inputs: [
      t('edit-contract.setRewardTokenLZParams.zroPaymentAddress-lbl'),
      t('edit-contract.setRewardTokenLZParams.adapterParams-lbl'),
    ],
    inputNotes: [
      t('edit-contract.setRewardTokenLZParams.zroPaymentAddress-note'),
      t('edit-contract.setRewardTokenLZParams.adapterParams-note'),
    ],
    validationRules: {
      'input-0': {
        required,
        address,
      },
      'input-1': {
        required,
        hex,
      },
    },
  },
  [CONTRACT_METHODS.editPool]: {
    methodName: CONTRACT_METHODS.editPool,
    note: t('edit-contract.editPool.note'),
    inputs: [
      t('edit-contract.editPool.poolId-lbl'),
      t('edit-contract.editPool.payoutStart-lbl'),
      t('edit-contract.editPool.decreaseInterval-lbl'),
      t('edit-contract.editPool.withdrawLockPeriod-lbl'),
      t('edit-contract.editPool.claimLockPeriod-lbl'),
      t('edit-contract.editPool.withdrawLockPeriodAfterStake-lbl'),
      t('edit-contract.editPool.initialReward-lbl'),
      t('edit-contract.editPool.rewardDecrease-lbl'),
      t('edit-contract.editPool.minimalStake-lbl'),
      t('edit-contract.editPool.isPublic-lbl'),
    ],
    inputNotes: [
      t('edit-contract.editPool.poolId-note'),
      t('edit-contract.editPool.payoutStart-note'),
      t('edit-contract.editPool.decreaseInterval-note'),
      t('edit-contract.editPool.withdrawLockPeriod-note'),
      t('edit-contract.editPool.claimLockPeriod-note'),
      t('edit-contract.editPool.withdrawLockPeriodAfterStake-note'),
      t('edit-contract.editPool.initialReward-note'),
      t('edit-contract.editPool.rewardDecrease-note'),
      t('edit-contract.editPool.minimalStake-note'),
      t('edit-contract.editPool.isPublic-note'),
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
      },
      'input-9': {
        required,
        minValue: minValue(0),
        maxValue: minValue(1),
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
  flex: 1;
  min-width: toRem(320);
  height: 100%;

  @include respond-to(medium) {
    max-width: 100%;
  }
}

.edit-contract__content-edit-wrp {
  width: 100%;
  border-left: toRem(1) solid var(--border-primary-dark);

  @include respond-to(medium) {
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
