<template>
  <modal
    class="basic-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #default="{ modal }">
      <div class="basic-modal__pane">
        <div class="basic-modal__header">
          <h3 v-if="title" class="basic-modal__title">
            {{ title }}
          </h3>
          <div v-if="$slots.subtitle" class="basic-modal__subtitle-slot-wrp">
            <slot name="subtitle" />
          </div>
          <p v-else-if="subtitle" class="basic-modal__subtitle">
            {{ subtitle }}
          </p>
          <button class="basic-modal__close-btn" @click="modal.close">
            <icon class="basic-modal__close-btn-icon" :name="$icons.x" />
          </button>
        </div>
        <slot :modal="{ close: modal.close }" />
      </div>
    </template>
  </modal>
</template>

<script lang="ts" setup>
import Icon from '../Icon.vue'
import Modal from '../Modal.vue'

withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
    title?: string
    subtitle?: string
  }>(),
  {
    title: '',
    subtitle: '',
    isCloseByClickOutside: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()
</script>

<style lang="scss">
.basic-modal__pane {
  padding: toRem(40) toRem(38) toRem(28);
  width: toRem(584);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #7c7c7d 0%, #cacaca 100%);
  background: linear-gradient(180deg, #222322 0%, #1d201c 100%),
    linear-gradient(180deg, #7c7c7d 0%, #cacaca 100%);

  @include respond-to(medium) {
    padding: toRem(36) toRem(20) toRem(24);
    width: toRem(344);
  }
}

.basic-modal__header {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.basic-modal__title {
  background: linear-gradient(90deg, #06f684, #1ab479);
  background-clip: text;
  color: transparent;
  text-align: center;
}

.basic-modal__subtitle-slot-wrp,
.basic-modal__subtitle {
  margin-top: toRem(32);
  text-align: center;

  @include respond-to(medium) {
    margin-top: toRem(20);
  }

  @include body-1-regular;
}

.basic-modal__close-btn {
  position: absolute;
  top: toRem(36);
  right: toRem(48);

  @include respond-to(medium) {
    top: toRem(16);
    right: toRem(16);
  }
}

.basic-modal__close-btn-icon {
  height: toRem(24);
  width: toRem(24);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  .basic-modal__close-btn:not([disabled]):hover &,
  .basic-modal__close-btn:not([disabled]):focus &,
  .basic-modal__close-btn:not([disabled]):active & {
    $color: #1ab479;

    color: $color;
  }
}
</style>
