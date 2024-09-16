import { ValidationRule } from '@vuelidate/core'
import { ContractMethods } from './index'

export type TokenContractInfo = {
  name: string
  symbol: string
  approvalRequired: boolean
  decimals: string
  endpoint: string
  oApp: string
  oAppVersion: {
    senderVersion: string
    receiverVersion: string
  }
  oftVersion: {
    interfaceId: string
    version: string
  }
  owner: string
  preCrime: string
  sharedDecimals: number
  totalSupply: string
}

export type DistributionContractInfo = {
  depositToken: string
  feeConfig: string
  l1Sender: string
  overplus: string
  owner: string
  totalDepositedInPublicPools: string
}

export type L1SenderContractInfo = {
  depositTokenConfig: {
    token: string
    gateway: string
    receiver: string
  }
  distribution: string
  owner: string
  rewardTokenConfig: {
    gateway: string
    receiver: string
    receiverChainId: string
    zroPaymentAddress: string
  }
  unwrappedDepositToken: string
}

export type L2MessageReceiverContractInfo = {
  config: {
    gateway: string
    sender: string
    senderChainId: number
  }
  owner: string
  rewardToken: string
}

export type L2TokenReceiverContractInfo = {
  firstSwapParams: {
    tokenIn: string
    tokenOut: string
    fee: number
  }
  nonfungiblePositionManager: string
  owner: string
  router: string
  secondSwapParams: {
    tokenIn: string
    tokenOut: string
    fee: number
  }
}

export type ContractEditionType = {
  methodName: ContractMethods
  note: string
  inputs: string[]
  inputNotes: string[]
  validationRules: {
    firstInput: ValidationRule
    secondInput?: ValidationRule
    thirdInput?: ValidationRule
    fourthInput?: ValidationRule
  }
}
