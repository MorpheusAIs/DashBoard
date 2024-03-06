import { factories, type Provider } from '@/types'
import { computed, unref, type ComputedRef, type MaybeRef } from 'vue'

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
    return _factoryClass.connect(
      unrefContractAddress,
      unref(provider).getSigner(),
    ) as Contract<K>
  })

  return { iface, providerBased, signerBased }
}
