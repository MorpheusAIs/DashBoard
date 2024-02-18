import { ETHEREUM_CHAINS, ETHEREUM_RPC_URLS } from '@/enums'
import { useWeb3ProvidersStore } from '@/store'
import { factories } from '@/types'
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
  rpcUrl?: Ref<ETHEREUM_RPC_URLS> | ETHEREUM_RPC_URLS,
): IUseContract<K> {
  type I = IUseContract<K>

  const web3ProvidersStore = useWeb3ProvidersStore()

  const provider: I['provider'] = computed(() => {
    const unrefRpcUrl = unref(rpcUrl)

    if (
      !unrefRpcUrl &&
      String(web3ProvidersStore.provider.chainId) ===
        (web3ProvidersStore.isMainnet
          ? ETHEREUM_CHAINS.ethereum
          : ETHEREUM_CHAINS.sepolia)
    )
      return new providers.Web3Provider(
        web3ProvidersStore.provider.rawProvider as providers.ExternalProvider,
      )

    return new providers.JsonRpcProvider(
      unrefRpcUrl ||
        (web3ProvidersStore.isMainnet
          ? ETHEREUM_RPC_URLS.ethereum
          : ETHEREUM_RPC_URLS.sepolia),
    )
  })

  const signer: I['signer'] = computed(() => provider.value.getSigner())

  const _factoryClass = ref<ContractFactoryClass>(factories[contractFactoryKey])

  const contractInterface: I['contractInterface'] = computed(
    () => _factoryClass.value.createInterface() as ContractInterface<K>,
  )

  const contractWithProvider: I['contractWithProvider'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    return _factoryClass.value.connect(
      unrefContractAddress,
      provider.value,
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
    provider,
    signer,
    contractInterface,
    contractWithProvider,
    contractWithSigner,
  }
}
