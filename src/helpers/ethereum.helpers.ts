import { Builders__factory, Provider } from '@/types'

type AbstractFactoryClass = {
  connect: (address: string, provider: Provider) => unknown
  createInterface: () => unknown
}

type AbstractFactoryClassReturnType<F extends AbstractFactoryClass> = {
  contractInstance: ReturnType<F['connect']>
  contractInterface: ReturnType<F['createInterface']>
}

export const createContract = <F extends AbstractFactoryClass>(
  address: string,
  provider: Provider,
  factoryClass: F,
): AbstractFactoryClassReturnType<F> => {
  const contractInstance = factoryClass.connect(
    address,
    provider,
  ) as ReturnType<F['connect']>

  const contractInterface = factoryClass.createInterface() as ReturnType<
    F['createInterface']
  >

  return {
    contractInstance,
    contractInterface,
  }
}

export const createBuildersContract = (address: string, provider: Provider) => {
  return createContract(address, provider, Builders__factory)
}

export function getEthExplorerTxUrl(explorerUrl: string, txHash: string) {
  return `${explorerUrl}/tx/${txHash}`
}

export function getEthExplorerAddressUrl(explorerUrl: string, address: string) {
  return `${explorerUrl}/address/${address}`
}
