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
      <transition name="fade">
        <claim-form
          v-if="isShown"
          class="claim-modal__form"
          :pool-id="poolId"
          @cancel="modal.close"
          @tx-sent="modal.close"
        />
      </transition>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { ClaimForm } from '@/forms'
import BasicModal from '../BasicModal.vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown: boolean
    amount: string
    poolId: number
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

.claim-modal__form {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}
</style>
