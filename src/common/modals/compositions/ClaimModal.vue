<template>
  <basic-modal
    class="claim-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('claim-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #subtitle>
      <i18n-t
        class="claim-modal__subtitle"
        keypath="claim-modal.subtitle"
        tag="p"
      >
        <template #reward>
          <span class="claim-modal__reward">
            {{ $t('claim-modal.reward', { amount }) }}
          </span>
        </template>
      </i18n-t>
    </template>
    <template #default="{ modal }">
      <div class="claim-modal__buttons-wrp">
        <app-button
          class="claim-modal__btn"
          color="secondary"
          :text="$t('claim-modal.close-btn')"
          @click="modal.close"
        />
        <app-button
          class="claim-modal__btn"
          :text="$t('claim-modal.claim-btn')"
        />
      </div>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import BasicModal from '../BasicModal.vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown: boolean
    amount: string
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)
</script>

<style lang="scss" scoped>
.claim-modal__subtitle {
  font: inherit;
}

.claim-modal__reward {
  white-space: nowrap;

  @include body-1-semi-bold;
}

.claim-modal__buttons-wrp {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(36);
  }
}

.claim-modal .claim-modal__btn {
  min-width: toRem(200);

  @include respond-to(medium) {
    min-width: min-content;
    width: 100%;
  }
}
</style>
