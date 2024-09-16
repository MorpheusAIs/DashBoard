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
}

export enum L1_SENDER_CONTRACT_METHODS {
  sendDepositToken = 'send deposit token',
  sendMintMessage = 'send mint message',
  transferOwnership = 'transfer ownership',
}

export enum L2_MESSAGE_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transfer ownership',
}

export enum L2_TOKEN_RECEIVER_CONTRACT_METHODS {
  transferOwnership = 'transfer ownership',
  collectFees = 'collect fees',
  decreaseLiquidityCurrentRange = 'decrease liquidity current range',
  increaseLiquidityCurrentRange = 'increase liquidity current range',
  withdrawToken = 'withdraw token',
  withdrawTokenId = 'withdraw token id',
}
