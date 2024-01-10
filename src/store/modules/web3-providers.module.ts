import { defineStore } from 'pinia'

const STORE_NAME = 'web3-providers-store'

export const useWeb3ProvidersStore = defineStore(STORE_NAME, {
  state: () => ({
    isConnectedProvider: false,
  }),
})
