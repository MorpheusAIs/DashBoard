import { exceptionContractsAllowedChains } from '@config'
import { useLimitedProvider } from '@/composables/use-limited-provider'

export const useExceptionContractsProvider = (
  feature: keyof typeof exceptionContractsAllowedChains,
) => {
  return useLimitedProvider(exceptionContractsAllowedChains[feature])
}
