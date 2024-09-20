export enum CONTRACT_TYPE {
  distribution = 'distribution',
  token = 'token',
  l1Sender = '1 Sender',
  l2TokenReceiver = 'l2 Token Receiver',
  l2MessageReceiver = 'l2 Message Receiver',
}

export enum TOKEN_CONTRACT_METHODS {
  mint = 'mint',
  transfer = 'transfer',
  transferOwnership = 'transfer ownership',
  approve = 'approve',
  burn = 'burn',
  increaseAllowance = 'increase allowance',
}

export enum DISTRIBUTION_CONTRACT_METHODS {
  bridgeOverplus = 'bridge overplus',
  createPool = 'create pool',
  editPool = 'edit pool',
  manageUsersInPrivatePool = 'manage users in private pool',
}

export enum L1_SENDER_CONTRACT_METHODS {
  transferOwnership = 'transfer ownership',
  setRewardTokenLZParams = 'set reward token lz params',
}

export enum L2_MESSAGE_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transfer ownership',
  retryMessage = 'retry message',
  setLzSender = 'set lz sender',
}

export enum L2_TOKEN_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transfer ownership',
  collectFees = 'collect fees',
  decreaseLiquidityCurrentRange = 'decrease liquidity current range',
  increaseLiquidityCurrentRange = 'increase liquidity current range',
  withdrawTokenId = 'withdraw token id',
  swap = 'swap',
  editParams = 'edit params',
}
