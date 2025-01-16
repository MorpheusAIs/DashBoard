/**
 * EIP-3085
 * @param chainId - A 0x-prefixed hexadecimal string
 * @param chainName - A human-readable chain name
 * @param nativeCurrency - An object with the following keys:
 *  - name: The name of the native currency
 *  - symbol: The symbol of the native currency
 *  - decimals: The number of decimals the currency uses
 * @param rpcUrls - An array of RPC endpoints available for this chain
 * @param blockExplorerUrls - An array of block explorer URLs
 * @param iconUrls - An array of URLs to chain icons
 */
export interface Chain {
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
