import { factories, type Provider } from '@/types'
import { providers } from 'ethers'
import { computed, unref, type ComputedRef, type MaybeRef } from 'vue'
import { errors } from '@/errors'

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
  iface: ContractInterface<K>
  providerBased: ComputedRef<Contract<K>>
  signerBased: ComputedRef<Contract<K>>
}

export function useContract<K extends ContractFactoryKey = ContractFactoryKey>(
  contractFactoryKey: K,
  contractAddress: MaybeRef<string>,
  provider: MaybeRef<Provider>,
): IUseContract<K> {
  type I = IUseContract<K>

  const _factoryClass = factories[contractFactoryKey]

  const iface: I['iface'] =
    _factoryClass.createInterface() as ContractInterface<K>

  const providerBased: I['providerBased'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    return _factoryClass.connect(
      unrefContractAddress,
      unref(provider),
    ) as Contract<K>
  })

  const signerBased: I['signerBased'] = computed(() => {
    const unrefContractAddress = unref(contractAddress)
    const unrefProvider = unref(provider)

    if (unrefProvider instanceof providers.FallbackProvider) {
      return new Proxy(
        {},
        {
          get: () => {
            throw new errors.FallbackProviderError()
          },
        },
      ) as Contract<K>
    }

    if (unrefProvider instanceof providers.Web3Provider) {
      return _factoryClass.connect(
        unrefContractAddress,
        unrefProvider.getSigner(
          (unrefProvider.provider as { selectedAddress: string })
            .selectedAddress,
        ),
      ) as Contract<K>
    }

    return _factoryClass.connect(
      unrefContractAddress,
      unrefProvider.getSigner(),
    ) as Contract<K>
  })

  return { iface, providerBased, signerBased }
}
