export enum CONTRACT_TYPE {
  distribution = 'distribution',
  token = 'token',
  l1Sender = 'l1Sender',
  l2TokenReceiver = 'l2TokenReceiver',
  l2MessageReceiver = 'l2MessageReceiver',
}

export enum TOKEN_CONTRACT_METHODS {
  renounceOwnership = 'renounceOwnership',
  mint = 'mint',
  transfer = 'transfer',
  transferOwnership = 'transferOwnership',
  approve = 'approve',
  burn = 'burn',
  increaseAllowance = 'increaseAllowance',
}

export enum DISTRIBUTION_CONTRACT_METHODS {
  bridgeOverplus = 'bridgeOverplus',
  createPool = 'createPool',
  editPool = 'editPool',
  manageUsersInPrivatePool = 'manageUsersInPrivatePool',
}

export enum L1_SENDER_CONTRACT_METHODS {
  transferOwnership = 'transferOwnership',
  setRewardTokenLZParams = 'setRewardTokenLZParams',
}

export enum L2_MESSAGE_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transferOwnership',
  retryMessage = 'retryMessage',
  setLzSender = 'setLzSender',
}

export enum L2_TOKEN_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transferOwnership',
  collectFees = 'collectFees',
  decreaseLiquidityCurrentRange = 'decreaseLiquidityCurrentRange',
  increaseLiquidityCurrentRange = 'increaseLiquidityCurrentRange',
  withdrawTokenId = 'withdrawTokenId',
  swap = 'swap',
  editParams = 'editParams',
}
