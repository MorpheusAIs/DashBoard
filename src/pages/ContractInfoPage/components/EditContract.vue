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
        :method-to-edit="methodsToEdit[chosenMethod]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CONTRACT_INFO_NAMES, CONTRACT_METHODS, CONTRACT_TYPE } from '@/enums'
import { computed, ref, watch } from 'vue'
import { ContractInfoHeader, ContractInfoMethods } from './ContractInfo'
import ContractEdition from './ContractEdition.vue'
import { address, minValue, required } from '@/validators'
import { ContractEditionType } from '@/types'
import { useI18n } from '@/composables'

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
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transfer]: {
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
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.mint]: {
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
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.burn]: {
    note: t('edit-contract.burn.note'),
    inputs: [t('edit-contract.burn.amount-lbl')],
    inputNotes: [t('edit-contract.burn.amount-note')],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseAllowance]: {
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
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.transferOwnership]: {
    note: t('edit-contract.transferOwnership.note'),
    inputs: [t('edit-contract.transferOwnership.new-owner-lbl')],
    inputNotes: [t('edit-contract.transferOwnership.new-owner-note')],
    validationRules: {
      firstInput: {
        required,
        address,
      },
    },
  },
  [CONTRACT_METHODS.bridgeOverplus]: {
    note: t('edit-contract.bridge-overplus.note'),
    inputs: [
      t('edit-contract.bridge-overplus.gasLimit-lbl'),
      t('edit-contract.bridge-overplus.maxFee-lbl'),
      t('edit-contract.bridge-overplus.submissionCost-lbl'),
    ],
    inputNotes: [
      t('edit-contract.bridge-overplus.gasLimit-note'),
      t('edit-contract.bridge-overplus.maxFee-note'),
      t('edit-contract.bridge-overplus.submissionCost-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.createPool]: {
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
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        required,
        minValue: minValue(0),
      },
      fourthInput: {
        required,
        minValue: minValue(0),
      },
      fifthInput: {
        required,
        minValue: minValue(0),
      },
      sixthInput: {
        required,
        minValue: minValue(0),
      },
      seventhInput: {
        required,
        minValue: minValue(0),
      },
      eighthInput: {
        required,
        minValue: minValue(0),
      },
      ninthInput: {
        required,
      },
    },
  },
  [CONTRACT_METHODS.manageUsersInPrivatePool]: {
    note: t('manage-contract.manage-users-in-private-pool.note'),
    inputs: [
      t('manage-contract.manage-users-in-private-pool.poolId-lbl'),
      t('manage-contract.manage-users-in-private-pool.users-lbl'),
      t('manage-contract.manage-users-in-private-pool.amounts-lbl'),
    ],
    inputNotes: [
      t('manage-contract.manage-users-in-private-pool.poolId-note'),
      t('manage-contract.manage-users-in-private-pool.users-note'),
      t('manage-contract.manage-users-in-private-pool.amounts-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        // type: 'array',
      },
      thirdInput: {
        required,
        // type: 'array',
      },
    },
  },
  [CONTRACT_METHODS.sendDepositToken]: {
    note: t('manage-contract.sendDepositToken.note'),
    inputs: [
      t('manage-contract.sendDepositToken.gasLimit-lbl'),
      t('manage-contract.sendDepositToken.maxFeePerGas-lbl'),
      t('manage-contract.sendDepositToken.maxSubmissionCost-lbl'),
    ],
    inputNotes: [
      t('manage-contract.sendDepositToken.gasLimit-note'),
      t('manage-contract.sendDepositToken.maxFeePerGas-note'),
      t('manage-contract.sendDepositToken.maxSubmissionCost-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.sendMintMessage]: {
    note: t('manage-contract.sendMintMessage.note'),
    inputs: [
      t('manage-contract.sendMintMessage.user-lbl'),
      t('manage-contract.sendMintMessage.amount-lbl'),
      t('manage-contract.sendMintMessage.refundTo-lbl'),
    ],
    inputNotes: [
      t('manage-contract.sendMintMessage.user-note'),
      t('manage-contract.sendMintMessage.amount-note'),
      t('manage-contract.sendMintMessage.refundTo-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        address,
      },
    },
  },
  [CONTRACT_METHODS.collectFees]: {
    note: t('manage-contract.collectFees.note'),
    inputs: [t('manage-contract.collectFees.tokenId-lbl')],
    inputNotes: [t('manage-contract.collectFees.tokenId-note')],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.decreaseLiquidityCurrentRange]: {
    note: t('manage-contract.decreaseLiquidityCurrentRange.note'),
    inputs: [
      t('manage-contract.decreaseLiquidityCurrentRange.tokenId-lbl'),
      t('manage-contract.decreaseLiquidityCurrentRange.liquidity-lbl'),
      t('manage-contract.decreaseLiquidityCurrentRange.amount0Min-lbl'),
      t('manage-contract.decreaseLiquidityCurrentRange.amount1Min-lbl'),
    ],
    inputNotes: [
      t('manage-contract.decreaseLiquidityCurrentRange.tokenId-note'),
      t('manage-contract.decreaseLiquidityCurrentRange.liquidity-note'),
      t('manage-contract.decreaseLiquidityCurrentRange.amount0Min-note'),
      t('manage-contract.decreaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        required,
        minValue: minValue(0),
      },
      fourthInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.increaseLiquidityCurrentRange]: {
    note: t('manage-contract.increaseLiquidityCurrentRange.note'),
    inputs: [
      t('manage-contract.increaseLiquidityCurrentRange.tokenId-lbl'),
      t('manage-contract.increaseLiquidityCurrentRange.amount0Add-lbl'),
      t('manage-contract.increaseLiquidityCurrentRange.amount1Add-lbl'),
      t('manage-contract.increaseLiquidityCurrentRange.amount0Min-lbl'),
      t('manage-contract.increaseLiquidityCurrentRange.amount1Min-lbl'),
    ],
    inputNotes: [
      t('manage-contract.increaseLiquidityCurrentRange.tokenId-note'),
      t('manage-contract.increaseLiquidityCurrentRange.amount0Add-note'),
      t('manage-contract.increaseLiquidityCurrentRange.amount1Add-note'),
      t('manage-contract.increaseLiquidityCurrentRange.amount0Min-note'),
      t('manage-contract.increaseLiquidityCurrentRange.amount1Min-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        minValue: minValue(0),
      },
      secondInput: {
        required,
        minValue: minValue(0),
      },
      thirdInput: {
        required,
        minValue: minValue(0),
      },
      fourthInput: {
        required,
        minValue: minValue(0),
      },
    },
  },
  [CONTRACT_METHODS.withdrawToken]: {
    note: t('manage-contract.withdrawToken.note'),
    inputs: [
      t('manage-contract.withdrawToken.recipient-lbl'),
      t('manage-contract.withdrawToken.token-lbl'),
      t('manage-contract.withdrawToken.amount-lbl'),
    ],
    inputNotes: [
      t('manage-contract.withdrawToken.recipient-note'),
      t('manage-contract.withdrawToken.token-note'),
      t('manage-contract.withdrawToken.amount-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        address,
      },
      thirdInput: {
        required,
      },
    },
  },
  [CONTRACT_METHODS.withdrawTokenId]: {
    note: t('manage-contract.withdrawTokenId.note'),
    inputs: [
      t('manage-contract.withdrawTokenId.recipient-lbl'),
      t('manage-contract.withdrawTokenId.token-lbl'),
      t('manage-contract.withdrawTokenId.tokenId-lbl'),
    ],
    inputNotes: [
      t('manage-contract.withdrawTokenId.recipient-note'),
      t('manage-contract.withdrawTokenId.token-note'),
      t('manage-contract.withdrawTokenId.tokenId-note'),
    ],
    validationRules: {
      firstInput: {
        required,
        address,
      },
      secondInput: {
        required,
        address,
      },
      thirdInput: {
        required,
        address,
      },
    },
  },
}))

const updateChosenMethod = (method: CONTRACT_METHODS) => {
  chosenMethod.value = method
}

watch(contractMethods, () => {
  chosenMethod.value = contractMethods.value[0]
})
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
}

.edit-contract__content-methods {
  max-width: toRem(320);
  border-right: toRem(1) solid var(--border-primary-dark);
}

.edit-contract__content-edit {
  margin: 0 auto;
  max-width: toRem(560);
}
</style>
