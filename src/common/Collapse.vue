<template>
  <div class="collapse" ref="rootEl">
    <transition
      name="collapse__body-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <div v-show="isShown" class="collapse__body">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

const props = withDefaults(
  defineProps<{
    isOpenedByDefault?: boolean
    isCloseByClickOutside?: boolean
    isShown: boolean
  }>(),
  {
    isOpenedByDefault: false,
    isCloseByClickOutside: true,
  },
)

const emit = defineEmits<{
  (event: 'update:isShown', value: boolean): void
}>()

const rootEl = ref<HTMLElement | null>(null)

onBeforeRouteUpdate(() => {
  closeCollapse()
})

onMounted(() => {
  if (rootEl.value) {
    if (props.isCloseByClickOutside) {
      onClickOutside(rootEl, () => {
        closeCollapse()
      })
    }
  }
})

const closeCollapse = () => {
  emit('update:isShown', false)
}

const setHeightCSSVar = (element: Element) => {
  ;(element as HTMLElement).style.setProperty(
    '--collapse-body-height',
    `${element.scrollHeight}px`,
  )
}
</script>

<style lang="scss" scoped>
.collapse__body {
  overflow: hidden;
}

.collapse__body-transition-enter-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out;
}

.collapse__body-transition-leave-active {
  animation: collapse-frame-keyframes 0.25s ease-in-out reverse;
}

@keyframes collapse-frame-keyframes {
  from {
    height: 0;
  }

  to {
    height: var(--collapse-body-height);
  }
}
</style>
