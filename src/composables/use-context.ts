import { getCurrentInstance } from 'vue'

export const useContext = () => {
  const app = getCurrentInstance()
  if (!app) throw new Error('app is null')

  const { $t, $config, $routes, $icons } =
    app.appContext.config.globalProperties

  return { $t, $config, $routes, $icons }
}
