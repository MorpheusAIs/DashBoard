<template>
  <basic-modal
    class="deposit-modal"
    :is-shown="isShown"
    :is-close-by-click-outside="isCloseByClickOutside"
    :title="$t('deposit-modal.title')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #default="{ modal }">
      <transition name="fade">
        <component
          v-if="isShown"
          :is="modalContent"
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
import MainnetDepositModalContent from './MainnetDepositModalContent.vue'
import { DepositForm } from '@/forms'
import { type BigNumber } from '@/types'
import BasicModal from '../../BasicModal.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { NETWORK_IDS } from '@config'

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    minStake: BigNumber
    claimLockEnd: string
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

const route = useRoute()
const isMainnet = computed(() => route.query.network === NETWORK_IDS.mainnet)

const modalContent = computed(() =>
  isMainnet.value ? MainnetDepositModalContent : DepositForm,
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
