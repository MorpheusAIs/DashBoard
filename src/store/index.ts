import { createPinia } from 'pinia'

const store = createPinia()

export { store }
export { defineStore, storeToRefs } from 'pinia'
export * from './modules'
