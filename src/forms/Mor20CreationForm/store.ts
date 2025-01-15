import { defineStore, storeToRefs, useWeb3ProvidersStore } from '@/store'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'
import { UNISWAP_FEE_OPTIONS } from './const'
import { STEP_IDS } from './enums'
import { type Form } from './types'

const STORE_NAME = 'mor20-creation-store'

export const useStore = defineStore(STORE_NAME, () => {
  const { address, networkType } = storeToRefs(useWeb3ProvidersStore())

  const formStorageKey = computed<string>(
    () => `${address.value}.${networkType.value}.mor20-creation-form`,
  )

  const form = useLocalStorage<Form>(formStorageKey.value, {
    stepId: STEP_IDS.general,
    generalConfig: {
      projectName: '',
    },
    arbitrumConfig: {
      tokenName: '',
      tokenSymbol: '',
      adminContractAddress: '',
      isUpgradeable: true,
      settings: {
        tokenInAddress: '',
        tokenOutAddress: '',
        firstSwapFee: UNISWAP_FEE_OPTIONS[2],
        secondSwapFee: UNISWAP_FEE_OPTIONS[2],
      },
    },
    ethereumConfig: {
      adminContractAddress: '',
      isUpgradeable: true,
      groups: [],
    },
  })

  return {
    // State
    form,

    // Getters
    formStorageKey,
  }
})
