import { createPinia } from 'pinia'

const store = createPinia()

export { store }
export { storeToRefs } from 'pinia'
export * from './modules'
