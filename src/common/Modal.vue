<template>
  <teleport to="#modal">
    <transition name="modal">
      <div v-show="isShown" class="modal" v-bind="$attrs">
        <div class="modal__pane" ref="modalPane">
          <slot :modal="{ close: closeModal }" :key="String(isShown)" />
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core'
import { onMounted, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    isShown?: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isShown: false,
    isCloseByClickOutside: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', value: boolean): void
}>()

const modalPane = ref<HTMLElement | undefined>()

onMounted(() => {
  if (modalPane.value) {
    if (props.isCloseByClickOutside) {
      onClickOutside(modalPane, () => {
        closeModal()
      })
    }
  }
})

const closeModal = () => {
  emit('update:is-shown', false)
}
</script>

<style lang="scss" scoped>
$z-index-local: 100;

.modal {
  --max-width: #{toRem(600)};

  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: vh(100);
  background: rgba(var(--black-rgb), 0.5);
  z-index: $z-index-local;
}

.modal__pane {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: auto;
  max-width: var(--max-width);
}

.modal-enter-active,
.modal-leave-active {
  transition: 0.25s ease;
  transition-property: opacity, transform;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}
</style>
