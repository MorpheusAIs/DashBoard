<template>
  <teleport to="#app-modals">
    <transition name="fade">
      <div v-show="isShown" class="app-modal" v-bind="$attrs">
        <div class="app-modal__pane">
          <slot :modal="{ close: closeModal }" />
        </div>
        <button class="app-modal__backdrop" @click="onBackdropClick" />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
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

const onBackdropClick = () => {
  if (props.isCloseByClickOutside) closeModal()
}

const closeModal = () => {
  emit('update:is-shown', false)
}
</script>

<style lang="scss" scoped>
$z-index: 1000;

.app-modal {
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
  z-index: $z-index;
}

.app-modal__pane {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: auto;
  max-width: var(--max-width);
}

.app-modal__backdrop {
  $z-index: -1;

  position: absolute;
  z-index: $z-index;
  inset: 0;
  width: 100%;
  cursor: default;
}
</style>
