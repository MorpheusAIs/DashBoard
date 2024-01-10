<template>
  <basic-modal
    v-bind="props"
    class="deposit-modal"
    :title="$t('deposit-modal.title')"
    :subtitle="$t('deposit-modal.subtitle')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #default="{ modal }">
      <deposit-form class="deposit-modal__form" @cancel="modal.close" />
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { DepositForm } from '@/forms'
import BasicModal from '../BasicModal.vue'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
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
