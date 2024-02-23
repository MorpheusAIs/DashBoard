import { NETWORKS } from '@/const'
import { ICON_NAMES, ROUTE_NAMES } from '@/enums'
import { config } from '@config'
import { useI18n } from 'vue-i18n'

export const useContext = () => {
  const { t } = useI18n({ useScope: 'global' })

  return {
    $t: t,
    $config: config,
    $routes: ROUTE_NAMES,
    $icons: ICON_NAMES,
    $networks: NETWORKS,
  }
}
