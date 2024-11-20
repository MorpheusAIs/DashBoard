import { SWAP_ASSETS_NAMES } from '@/enums'

export const SWAP_ASSETS = [
  {
    symbol: SWAP_ASSETS_NAMES.STETH,
    address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  },
  {
    symbol: SWAP_ASSETS_NAMES.WETH,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
  // TODO: HIDDEN AND WAITING FOR FIX
  // {
  //   symbol: SWAP_ASSETS_NAMES.WBTC,
  //   address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  // },
  // {
  //   symbol: SWAP_ASSETS_NAMES.USDC,
  //   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  // },
]
