<template>
  <div class="edit-contract">
    <header>
      <contract-info-header
        :name="$t('edit-contract.title')"
        :project-name="contractName"
        :type="CONTRACT_INFO_ACTIONS.edit"
        :network="network"
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
        <contract-editing
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
import { CONTRACT_INFO_ACTIONS, CONTRACT_TYPE, CONTRACT_INPUTS } from '@/enums'
import { computed, ref, watch } from 'vue'
import { ContractInfoHeader, ContractInfoMethods } from './ContractInfo'
import ContractEditing from './ContractEditing.vue'
import { address, minValue, maxValue, required, hex } from '@/validators'
import { ContractEditingType, ContractMethods } from '@/types'
import { useI18n } from '@/composables'
import { CONTRACT_METHODS } from '@/const'
import { EthereumChains } from '@config'

type ContractMethodsConfig = {
  [key in keyof typeof CONTRACT_METHODS]: ContractEditingType
}

const props = defineProps<{
  contractType: CONTRACT_TYPE
  network: EthereumChains
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
        CONTRACT_METHODS.renounceOwnership,
      ]
    case CONTRACT_TYPE.distribution:
      return [
        CONTRACT_METHODS.bridgeOverplus,
        CONTRACT_METHODS.createPool,
        CONTRACT_METHODS.editPool,
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.renounceOwnership,
        // TODO: THINK ABOUT ARRAY VALIDATION
        // CONTRACT_METHODS.manageUsersInPrivatePool,
      ]
    case CONTRACT_TYPE.l1Sender:
      return [
        CONTRACT_METHODS.setRewardTokenLZParams,
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.renounceOwnership,
      ]
    case CONTRACT_TYPE.l2MessageReceiver:
      return [
        CONTRACT_METHODS.retryMessage,
        CONTRACT_METHODS.setLzSender,
        CONTRACT_METHODS.transferOwnership,
        CONTRACT_METHODS.renounceOwnership,
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
        CONTRACT_METHODS.renounceOwnership,
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
      {
        id: CONTRACT_INPUTS.spender,
        displayedName: t('edit-contract.approve.spender-lbl'),
      },
      {
        id: CONTRACT_INPUTS.amount,
        displayedName: t('edit-contract.approve.amount-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.approve.spender-note'),
      t('edit-contract.approve.amount-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.spender}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.amount}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transfer]: {
    methodName: CONTRACT_METHODS.transfer,
    note: t('edit-contract.transfer.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.to,
        displayedName: t('edit-contract.transfer.to-lbl'),
      },
      {
        id: CONTRACT_INPUTS.amount,
        displayedName: t('edit-contract.transfer.amount-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.transfer.to-note'),
      t('edit-contract.transfer.amount-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.to}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.amount}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.burn]: {
    methodName: CONTRACT_METHODS.burn,
    note: t('edit-contract.burn.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.amount,
        displayedName: t('edit-contract.burn.amount-lbl'),
      },
    ],
    inputNotes: [t('edit-contract.burn.amount-note')],
    validationRules: {
      [`input-${CONTRACT_INPUTS.amount}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseAllowance]: {
    methodName: CONTRACT_METHODS.increaseAllowance,
    note: t('edit-contract.increaseAllowance.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.spender,
        displayedName: t('edit-contract.increaseAllowance.spender-lbl'),
      },
      {
        id: CONTRACT_INPUTS.amount,
        displayedName: t('edit-contract.increaseAllowance.amount-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.increaseAllowance.spender-note'),
      t('edit-contract.increaseAllowance.amount-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.spender}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.amount}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transferOwnership]: {
    methodName: CONTRACT_METHODS.transferOwnership,
    note: t('edit-contract.transferOwnership.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.newOwner,
        displayedName: t('edit-contract.transferOwnership.new-owner-lbl'),
      },
    ],
    inputNotes: [t('edit-contract.transferOwnership.new-owner-note')],
    validationRules: {
      [`input-${CONTRACT_INPUTS.newOwner}`]: {
        required,
        address,
      },
    },
  },
  [CONTRACT_METHODS.bridgeOverplus]: {
    methodName: CONTRACT_METHODS.bridgeOverplus,
    note: t('edit-contract.bridge-overplus.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.gasLimit,
        displayedName: t('edit-contract.bridge-overplus.gasLimit-lbl'),
      },
      {
        id: CONTRACT_INPUTS.maxFee,
        displayedName: t('edit-contract.bridge-overplus.maxFee-lbl'),
      },
      {
        id: CONTRACT_INPUTS.submissionCost,
        displayedName: t('edit-contract.bridge-overplus.submissionCost-lbl'),
      },
      {
        id: CONTRACT_INPUTS.bridgeValue,
        displayedName: t('edit-contract.bridge-overplus.bridge-value-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.bridge-overplus.gasLimit-note'),
      t('edit-contract.bridge-overplus.maxFee-note'),
      t('edit-contract.bridge-overplus.submissionCost-note'),
      t('edit-contract.bridge-overplus.bridge-value-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.gasLimit}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.maxFee}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.submissionCost}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.bridgeValue}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.createPool]: {
    methodName: CONTRACT_METHODS.createPool,
    note: t('edit-contract.createPool.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.payoutStart,
        displayedName: t('edit-contract.createPool.payoutStart-lbl'),
      },
      {
        id: CONTRACT_INPUTS.decreaseInterval,
        displayedName: t('edit-contract.createPool.decreaseInterval-lbl'),
      },
      {
        id: CONTRACT_INPUTS.withdrawLockPeriod,
        displayedName: t('edit-contract.createPool.withdrawLockPeriod-lbl'),
      },
      {
        id: CONTRACT_INPUTS.claimLockPeriod,
        displayedName: t('edit-contract.createPool.claimLockPeriod-lbl'),
      },
      {
        id: CONTRACT_INPUTS.withdrawLockPeriodAfterStake,
        displayedName: t(
          'edit-contract.createPool.withdrawLockPeriodAfterStake-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.initialReward,
        displayedName: t('edit-contract.createPool.initialReward-lbl'),
      },
      {
        id: CONTRACT_INPUTS.rewardDecrease,
        displayedName: t('edit-contract.createPool.rewardDecrease-lbl'),
      },
      {
        id: CONTRACT_INPUTS.minimalStake,
        displayedName: t('edit-contract.createPool.minimalStake-lbl'),
      },
      {
        id: CONTRACT_INPUTS.isPublic,
        displayedName: t('edit-contract.createPool.isPublic-lbl'),
      },
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
      [`input-${CONTRACT_INPUTS.payoutStart}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.decreaseInterval}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.withdrawLockPeriod}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.claimLockPeriod}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.withdrawLockPeriodAfterStake}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.initialReward}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.rewardDecrease}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.minimalStake}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.isPublic}`]: {
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
      {
        id: CONTRACT_INPUTS.poolId,
        displayedName: t(
          'edit-contract.manage-users-in-private-pool.poolId-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.users,
        displayedName: t(
          'edit-contract.manage-users-in-private-pool.users-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amounts,
        displayedName: t(
          'edit-contract.manage-users-in-private-pool.amounts-lbl',
        ),
      },
    ],
    inputNotes: [
      t('edit-contract.manage-users-in-private-pool.poolId-note'),
      t('edit-contract.manage-users-in-private-pool.users-note'),
      t('edit-contract.manage-users-in-private-pool.amounts-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.poolId}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.users}`]: {
        required,
        // type: 'array',
      },
      [`input-${CONTRACT_INPUTS.amounts}`]: {
        required,
        // type: 'array',
      },
    },
  },
  [CONTRACT_METHODS.collectFees]: {
    methodName: CONTRACT_METHODS.collectFees,
    note: t('edit-contract.collectFees.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.tokenId,
        displayedName: t('edit-contract.collectFees.tokenId-lbl'),
      },
    ],
    inputNotes: [t('edit-contract.collectFees.tokenId-note')],
    validationRules: {
      [`input-${CONTRACT_INPUTS.tokenId}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.decreaseLiquidityCurrentRange]: {
    methodName: CONTRACT_METHODS.decreaseLiquidityCurrentRange,
    note: t('edit-contract.decreaseLiquidityCurrentRange.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.tokenId,
        displayedName: t(
          'edit-contract.decreaseLiquidityCurrentRange.tokenId-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.liquidity,
        displayedName: t(
          'edit-contract.decreaseLiquidityCurrentRange.liquidity-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amount0Min,
        displayedName: t(
          'edit-contract.decreaseLiquidityCurrentRange.amount0Min-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amount1Min,
        displayedName: t(
          'edit-contract.decreaseLiquidityCurrentRange.amount1Min-lbl',
        ),
      },
    ],
    inputNotes: [
      t('edit-contract.decreaseLiquidityCurrentRange.tokenId-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.liquidity-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount0Min-note'),
      t('edit-contract.decreaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.tokenId}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.liquidity}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amount0Min}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amount1Min}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseLiquidityCurrentRange]: {
    methodName: CONTRACT_METHODS.increaseLiquidityCurrentRange,
    note: t('edit-contract.increaseLiquidityCurrentRange.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.tokenId,
        displayedName: t(
          'edit-contract.increaseLiquidityCurrentRange.tokenId-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.liquidity,
        displayedName: t(
          'edit-contract.increaseLiquidityCurrentRange.amount0Add-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amount1Add,
        displayedName: t(
          'edit-contract.increaseLiquidityCurrentRange.amount1Add-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amount0Min,
        displayedName: t(
          'edit-contract.increaseLiquidityCurrentRange.amount0Min-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.amount1Min,
        displayedName: t(
          'edit-contract.increaseLiquidityCurrentRange.amount1Min-lbl',
        ),
      },
    ],
    inputNotes: [
      t('edit-contract.increaseLiquidityCurrentRange.tokenId-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Add-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Add-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount0Min-note'),
      t('edit-contract.increaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.tokenId}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.liquidity}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amount1Add}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amount0Min}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amount1Min}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.withdrawTokenId]: {
    methodName: CONTRACT_METHODS.withdrawTokenId,
    note: t('edit-contract.withdrawTokenId.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.recipient,
        displayedName: t('edit-contract.withdrawTokenId.recipient-lbl'),
      },
      {
        id: CONTRACT_INPUTS.token,
        displayedName: t('edit-contract.withdrawTokenId.token-lbl'),
      },
      {
        id: CONTRACT_INPUTS.tokenId,
        displayedName: t('edit-contract.withdrawTokenId.tokenId-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.withdrawTokenId.recipient-note'),
      t('edit-contract.withdrawTokenId.token-note'),
      t('edit-contract.withdrawTokenId.tokenId-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.recipient}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.token}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.tokenId}`]: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.swap]: {
    methodName: CONTRACT_METHODS.swap,
    note: t('edit-contract.swap.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.amountIn,
        displayedName: t('edit-contract.swap.amountIn-lbl'),
      },
      {
        id: CONTRACT_INPUTS.amountOutMinimum,
        displayedName: t('edit-contract.swap.amountOutMinimum-lbl'),
      },
      {
        id: CONTRACT_INPUTS.deadline,
        displayedName: t('edit-contract.swap.deadline-lbl'),
      },
      {
        id: CONTRACT_INPUTS.sqrtPriceLimitX96,
        displayedName: t('edit-contract.swap.sqrtPriceLimitX96-lbl'),
      },
      {
        id: CONTRACT_INPUTS.isUseFirstSwapParams,
        displayedName: t('edit-contract.swap.isUseFirstSwapParams-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.swap.amountIn-note'),
      t('edit-contract.swap.amountOutMinimum-note'),
      t('edit-contract.swap.deadline-note'),
      t('edit-contract.swap.sqrtPriceLimitX96-note'),
      t('edit-contract.swap.isUseFirstSwapParams-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.amountIn}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.amountOutMinimum}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.deadline}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.sqrtPriceLimitX96}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.isUseFirstSwapParams}`]: {
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
      {
        id: CONTRACT_INPUTS.tokenIn,
        displayedName: t('edit-contract.editParams.tokenIn-lbl'),
      },
      {
        id: CONTRACT_INPUTS.tokenOut,
        displayedName: t('edit-contract.editParams.tokenOut-lbl'),
      },
      {
        id: CONTRACT_INPUTS.fee,
        displayedName: t('edit-contract.editParams.fee-lbl'),
      },
      {
        id: CONTRACT_INPUTS.isEditFirstParams,
        displayedName: t('edit-contract.editParams.isEditFirstParams-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.editParams.tokenIn-note'),
      t('edit-contract.editParams.tokenOut-note'),
      t('edit-contract.editParams.fee-note'),
      t('edit-contract.editParams.isEditFirstParams-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.tokenIn}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.tokenOut}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.fee}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.isEditFirstParams}`]: {
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
      {
        id: CONTRACT_INPUTS.senderChainId,
        displayedName: t('edit-contract.retryMessage.senderChainId-lbl'),
      },
      {
        id: CONTRACT_INPUTS.senderAndReceiverAddresses,
        displayedName: t(
          'edit-contract.retryMessage.senderAndReceiverAddresses-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.nonce,
        displayedName: t('edit-contract.retryMessage.nonce-lbl'),
      },
      {
        id: CONTRACT_INPUTS.payload,
        displayedName: t('edit-contract.retryMessage.payload-lbl'),
      },
    ],
    inputNotes: [
      t('edit-contract.retryMessage.senderChainId-note'),
      t('edit-contract.retryMessage.senderAndReceiverAddresses-note'),
      t('edit-contract.retryMessage.nonce-note'),
      t('edit-contract.retryMessage.payload-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.senderChainId}`]: {
        required,
        minValue: minValue(1),
      },
      [`input-${CONTRACT_INPUTS.senderAndReceiverAddresses}`]: {
        required,
        hex,
      },
      [`input-${CONTRACT_INPUTS.nonce}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.payload}`]: {
        required,
        hex,
      },
    },
  },
  [CONTRACT_METHODS.setLzSender]: {
    methodName: CONTRACT_METHODS.setLzSender,
    note: t('edit-contract.setLzSender.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.lzSender,
        displayedName: t('edit-contract.setLzSender.lzSender-lbl'),
      },
    ],
    inputNotes: [t('edit-contract.setLzSender.lzSender-note')],
    validationRules: {
      [`input-${CONTRACT_INPUTS.lzSender}`]: {
        required,
        address,
      },
    },
  },
  [CONTRACT_METHODS.setRewardTokenLZParams]: {
    methodName: CONTRACT_METHODS.setRewardTokenLZParams,
    note: t('edit-contract.setRewardTokenLZParams.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.zroPaymentAddress,
        displayedName: t(
          'edit-contract.setRewardTokenLZParams.zroPaymentAddress-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.adapterParams,
        displayedName: t(
          'edit-contract.setRewardTokenLZParams.adapterParams-lbl',
        ),
      },
    ],
    inputNotes: [
      t('edit-contract.setRewardTokenLZParams.zroPaymentAddress-note'),
      t('edit-contract.setRewardTokenLZParams.adapterParams-note'),
    ],
    validationRules: {
      [`input-${CONTRACT_INPUTS.zroPaymentAddress}`]: {
        required,
        address,
      },
      [`input-${CONTRACT_INPUTS.adapterParams}`]: {
        required,
        hex,
      },
    },
  },
  [CONTRACT_METHODS.editPool]: {
    methodName: CONTRACT_METHODS.editPool,
    note: t('edit-contract.editPool.note'),
    inputs: [
      {
        id: CONTRACT_INPUTS.poolId,
        displayedName: t('edit-contract.editPool.poolId-lbl'),
      },
      {
        id: CONTRACT_INPUTS.payoutStart,
        displayedName: t('edit-contract.editPool.payoutStart-lbl'),
      },
      {
        id: CONTRACT_INPUTS.decreaseInterval,
        displayedName: t('edit-contract.editPool.decreaseInterval-lbl'),
      },
      {
        id: CONTRACT_INPUTS.withdrawLockPeriod,
        displayedName: t('edit-contract.editPool.withdrawLockPeriod-lbl'),
      },
      {
        id: CONTRACT_INPUTS.claimLockPeriod,
        displayedName: t('edit-contract.editPool.claimLockPeriod-lbl'),
      },
      {
        id: CONTRACT_INPUTS.withdrawLockPeriodAfterStake,
        displayedName: t(
          'edit-contract.editPool.withdrawLockPeriodAfterStake-lbl',
        ),
      },
      {
        id: CONTRACT_INPUTS.initialReward,
        displayedName: t('edit-contract.editPool.initialReward-lbl'),
      },
      {
        id: CONTRACT_INPUTS.rewardDecrease,
        displayedName: t('edit-contract.editPool.rewardDecrease-lbl'),
      },
      {
        id: CONTRACT_INPUTS.minimalStake,
        displayedName: t('edit-contract.editPool.minimalStake-lbl'),
      },
      {
        id: CONTRACT_INPUTS.isPublic,
        displayedName: t('edit-contract.editPool.isPublic-lbl'),
      },
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
      [`input-${CONTRACT_INPUTS.poolId}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.payoutStart}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.decreaseInterval}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.withdrawLockPeriod}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.claimLockPeriod}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.withdrawLockPeriodAfterStake}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.initialReward}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.rewardDecrease}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.minimalStake}`]: {
        required,
        minValue: minValue(0),
      },
      [`input-${CONTRACT_INPUTS.isPublic}`]: {
        required,
        minValue: minValue(0),
        maxValue: minValue(1),
      },
    },
  },
  [CONTRACT_METHODS.renounceOwnership]: {
    methodName: CONTRACT_METHODS.renounceOwnership,
    note: t('edit-contract.renounceOwnership.note'),
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
