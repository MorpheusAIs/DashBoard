/** EIP-3085 */
export interface Chain {
  /** A 0x-prefixed hexadecimal string */
  chainId: string

  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls?: string[]
  iconUrls?: string[]
}
