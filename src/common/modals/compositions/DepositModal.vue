<template>
  <basic-modal
    class="deposit-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('deposit-modal.title')"
    :subtitle="$t('deposit-modal.subtitle')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #default="{ modal }">
      <transition name="fade">
        <deposit-form
          v-if="isShown"
          class="deposit-modal__form"
          :pool-id="poolId"
          :min-stake="minStake"
          @cancel="modal.close"
          @stake-tx-sent="modal.close"
        />
      </transition>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { DepositForm } from '@/forms'
import { type BigNumber } from '@/types'
import BasicModal from '../BasicModal.vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    minStake: BigNumber
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)
</script>

<style lang="scss" scoped>
.deposit-modal__form {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(28);
  }
}
</style>
