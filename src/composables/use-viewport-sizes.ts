import { WINDOW_BREAKPOINTS } from '@/enums'
import { useWindowSize } from '@vueuse/core'
import { computed, type ComputedRef } from 'vue'

export interface IUseViewportSizes {
  isSmallBreakpoint: ComputedRef<boolean>
}

export const useViewportSizes = (): IUseViewportSizes => {
  const { width } = useWindowSize()

  const isSmallBreakpoint = computed(
    () => width.value < WINDOW_BREAKPOINTS.small,
  )

  return { isSmallBreakpoint }
}
