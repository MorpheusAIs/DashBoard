import { SUPPORTED_PROVIDERS } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { factories } from '@/types'
import { providers } from 'ethers'
import { computed, ref, type ComputedRef, type Ref, unref } from 'vue'

type ContractFactoryKey = keyof typeof factories
type ContractFactoryClass<K extends ContractFactoryKey = ContractFactoryKey> =
  (typeof factories)[K]

type Contract<K extends ContractFactoryKey = ContractFactoryKey> = ReturnType<
  ContractFactoryClass<K>['connect']
>

type ContractInterface<K extends ContractFactoryKey = ContractFactoryKey> =
  ReturnType<ContractFactoryClass<K>['createInterface']>

export interface IUseContract<
  K extends ContractFactoryKey = ContractFactoryKey,
> {
  provider: ComputedRef<providers.Web3Provider | providers.JsonRpcProvider>
  signer: ComputedRef<providers.JsonRpcSigner | null>

  contractInterface: ComputedRef<ContractInterface<K>>

  contractWithProvider: ComputedRef<Contract<K> | null>
  contractWithSigner: ComputedRef<Contract<K> | null>
}

export function useContract<K extends ContractFactoryKey = ContractFactoryKey>(
  contractFactoryKey: K,
  contractAddress: Ref<string> | string,
): IUseContract<K> {
  type I = IUseContract<K>

  const web3ProvidersStore = useWeb3ProvidersStore()
  const storedProvider = computed(() => web3ProvidersStore.provider)

  const provider: I['provider'] = computed(() =>
    storedProvider.value.selectedProvider !== SUPPORTED_PROVIDERS.Fallback
      ? new providers.Web3Provider(
          storedProvider.value.rawProvider as providers.ExternalProvider,
        )
      : (storedProvider.value
          .rawProvider as unknown as providers.JsonRpcProvider),
  )

  const signer: I['signer'] = computed(() => provider.value.getSigner())

  const _factoryClass = ref<ContractFactoryClass>(factories[contractFactoryKey])

  const contractInterface: I['contractInterface'] = computed(
    () => _factoryClass.value.createInterface() as ContractInterface<K>,
  )

  const contractWithProvider: I['contractWithProvider'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    if (!provider.value || !unrefContractAddress) return null
    return _factoryClass.value.connect(
      unrefContractAddress,
      provider.value,
    ) as Contract<K>
  })

  const contractWithSigner: I['contractWithSigner'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    if (!signer.value || !unrefContractAddress) return null
    return _factoryClass.value.connect(
      unrefContractAddress,
      signer.value,
    ) as Contract<K>
  })

  return {
    provider,
    signer,
    contractInterface,
    contractWithProvider,
    contractWithSigner,
  }
}
