import { type ICON_NAMES } from '@/enums'

export type Indicator = {
  iconName: ICON_NAMES
  title: string
  value: string
}

export type DashboardInfo = {
  name: string
  distributionAddress: string
  l1SenderAddress: string
  l2MessageReceiverAddress: string
  l2TokenReceiverAddress: string
  tokenAddress: string
}
