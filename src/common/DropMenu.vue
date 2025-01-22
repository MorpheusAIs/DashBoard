<template>
  <transition name="drop">
    <div
      v-show="isShown"
      ref="dropMenuElement"
      class="drop-menu"
      :class="[`drop-menu--${modification}`]"
      @pointerleave="onPointerLeave"
    >
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { useRouter } from '@/router'
import { onClickOutside } from '@vueuse/core'
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (event: 'update:is-shown', value: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown?: boolean
    isHideOnClickOutside?: boolean
    isHideOnPointerLeave?: boolean
    isHideOnRouteChange?: boolean
    modification?: 'dropdown' | 'dropup'
  }>(),
  {
    isShown: false,
    isHideOnClickOutside: false,
    isHideOnPointerLeave: false,
    isHideOnRouteChange: true,
    modification: 'dropdown',
  },
)

const { currentRoute } = useRouter()

const dropMenuElement = ref<HTMLDivElement | null>(null)

const onPointerLeave = () => {
  if (props.isHideOnPointerLeave) emit('update:is-shown', false)
}

onClickOutside(dropMenuElement, () => {
  if (props.isHideOnClickOutside) emit('update:is-shown', false)
})

watch(
  () => currentRoute.value.fullPath,
  () => {
    if (props.isHideOnRouteChange) emit('update:is-shown', false)
  },
)
</script>

<style lang="scss">
$z-index: 2;

.drop-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden auto;
  right: 0;
  width: 100%;
  min-width: max-content;
  max-height: 500%;
  z-index: $z-index;
  background: var(--field-bg-primary);
  box-shadow: 0 toRem(4) toRem(16) rgba(#a0a0a0, 0.25);

  &--dropdown {
    top: 120%;
  }

  &--dropup {
    bottom: 120%;
  }
}
</style>
