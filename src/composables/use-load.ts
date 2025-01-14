import { computed, Ref, ref, watch } from 'vue'
import { ErrorHandler } from '@/helpers'

export const useLoad = <T>(
  defaultData: T,
  loadFn: () => Promise<T>,
  args?: {
    isLoadOnMount?: boolean
    updateArgs?: unknown[]
    reloadArgs?: unknown[]
  },
): {
  data: Ref<T>
  isLoaded: Ref<boolean>
  isLoadFailed: Ref<boolean>
  update: () => Promise<void>
  reload: () => Promise<void>
} => {
  const isLoaded = ref(false)
  const isLoadFailed = ref(false)

  const data = ref<T>(defaultData)

  const defaultArgs = computed(() => ({
    isLoadOnMount: true,
    reloadArgs: args?.reloadArgs ?? [],
    updateArgs: args?.updateArgs ?? [],
    ...args,
  }))

  const load = async () => {
    isLoaded.value = false
    isLoadFailed.value = false

    try {
      data.value = await loadFn()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      isLoadFailed.value = true
    }
    isLoaded.value = true
  }

  const update = async () => {
    try {
      data.value = await loadFn()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
      isLoadFailed.value = true
    }
  }

  watch(defaultArgs.value.updateArgs, update)
  watch(
    [...defaultArgs.value.reloadArgs, defaultArgs.value.isLoadOnMount],
    load,
    {
      immediate: Boolean(defaultArgs.value?.isLoadOnMount),
    },
  )

  return {
    data: data as Ref<T>,

    isLoaded,
    isLoadFailed,

    reload: load,
    update,
  }
}
