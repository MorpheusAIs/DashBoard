import { useWeb3ProvidersStore } from '@/store'
import { factories } from '@/types'
import { config } from '@config'
import { providers } from 'ethers'
import { computed, type ComputedRef, ref, type Ref, unref } from 'vue'

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
  signer: ComputedRef<providers.JsonRpcSigner>

  contractInterface: ComputedRef<ContractInterface<K>>

  contractWithProvider: ComputedRef<Contract<K>>
  contractWithSigner: ComputedRef<Contract<K>>
}

export function useContract<K extends ContractFactoryKey = ContractFactoryKey>(
  contractFactoryKey: K,
  contractAddress: Ref<string> | string,
  provider?: providers.JsonRpcProvider,
): IUseContract<K> {
  type I = IUseContract<K>

  const web3ProvidersStore = useWeb3ProvidersStore()

  const _provider: I['provider'] = computed(() => {
    if (
      !provider &&
      String(web3ProvidersStore.provider.chainId) ===
        config.networks[web3ProvidersStore.networkId].chainId
    )
      return new providers.Web3Provider(
        web3ProvidersStore.provider.rawProvider as providers.ExternalProvider,
      )

    return provider || config.networks[web3ProvidersStore.networkId].provider
  })

  const signer: I['signer'] = computed(() => _provider.value.getSigner())

  const _factoryClass = ref<ContractFactoryClass>(factories[contractFactoryKey])

  const contractInterface: I['contractInterface'] = computed(
    () => _factoryClass.value.createInterface() as ContractInterface<K>,
  )

  const contractWithProvider: I['contractWithProvider'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    return _factoryClass.value.connect(
      unrefContractAddress,
      _provider.value,
    ) as Contract<K>
  })

  const contractWithSigner: I['contractWithSigner'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    return _factoryClass.value.connect(
      unrefContractAddress,
      signer.value,
    ) as Contract<K>
  })

  return {
    provider: _provider,
    signer,
    contractInterface,
    contractWithProvider,
    contractWithSigner,
  }
}
