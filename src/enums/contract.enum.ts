export enum CONTRACT_TYPE {
  distribution = 'distribution',
  token = 'token',
  l1Sender = '1 Sender',
  l2TokenReceiver = 'l2 Token Receiver',
  l2MessageReceiver = 'l2 Message Receiver',
}

export enum CONTRACT_METHODS {
  approve = 'approve',
  burn = 'burn',
  increaseAllowance = 'increase allowance',
  mint = 'mint',
  transfer = 'transfer',
  transferOwnership = 'transfer ownership',

  bridgeOverplus = 'bridge overplus',
  createPool = 'create pool',
  manageUsersInPrivatePool = 'manage users in private pool',

  sendDepositToken = 'send deposit token',
  sendMintMessage = 'send mint message',

  collectFees = 'collect fees',
  decreaseLiquidityCurrentRange = 'decrease liquidity current range',
  increaseLiquidityCurrentRange = 'increase liquidity current range',
  withdrawToken = 'withdraw token',
  withdrawTokenId = 'withdraw token id',
}
