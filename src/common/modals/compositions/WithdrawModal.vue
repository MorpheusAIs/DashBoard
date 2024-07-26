<template>
  <basic-modal
    v-bind="props"
    class="withdraw-modal"
    :title="$t('withdraw-modal.title')"
    :subtitle="$t('withdraw-modal.subtitle')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <template #default="{ modal }">
      <div class="withdraw-modal__indicators">
        <div
          v-for="(indicator, idx) in indicators"
          :key="idx"
          class="withdraw-modal__indicator"
        >
          <div class="withdraw-modal__indicator-title-wrp">
            <app-icon
              class="withdraw-modal__indicator-icon"
              :name="indicator.iconName"
            />
            <h5 class="withdraw-modal__indicator-title">
              {{ indicator.title }}
            </h5>
          </div>
          <p class="withdraw-modal__indicator-value">
            {{ indicator.value }}
          </p>
        </div>
      </div>
      <transition name="fade">
        <withdraw-form
          v-if="isShown"
          class="withdraw-modal__form"
          :pool-id="poolId"
          :available-amount="availableAmount"
          @cancel="modal.close"
          @tx-sent="modal.close"
        />
      </transition>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
import { useI18n } from '@/composables'
import { ICON_NAMES } from '@/enums'
import { WithdrawForm } from '@/forms'
import { type BigNumber } from '@/types'
import { formatEther } from '@/utils'
import { computed } from 'vue'
import AppIcon from '../../AppIcon.vue'
import BasicModal from '../BasicModal.vue'

type Indicator = {
  iconName: ICON_NAMES
  title: string
  value: string
}

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    poolId: number
    availableAmount: BigNumber
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: true,
  },
)

const { t } = useI18n()

const indicators = computed<Indicator[]>(() => [
  {
    iconName: ICON_NAMES.ethereum,
    title: t('withdraw-modal.available-to-withdraw-title'),
    value: `${formatEther(props.availableAmount)} stETH`,
  },
])
</script>

<style lang="scss" scoped>
.withdraw-modal__indicators {
  margin-top: toRem(24);
  display: grid;
  grid-gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(20);
  }
}

.withdraw-modal__indicator {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: toRem(16);

  @include respond-to(medium) {
    grid-template-columns: 1fr;
    grid-gap: toRem(4);
  }
}

.withdraw-modal__indicator-title-wrp {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(8);

  @include respond-to(medium) {
    grid-gap: toRem(4);
  }
}

.withdraw-modal__indicator-icon {
  height: toRem(24);
  width: toRem(24);

  @include respond-to(medium) {
    height: toRem(20);
    width: toRem(20);
  }
}

.withdraw-modal__indicator-title {
  @include body-3-regular;
}

.withdraw-modal__indicator-value {
  text-align: right;

  @include body-3-semi-bold;

  @include text-ellipsis;

  @include respond-to(medium) {
    text-align: left;
    padding-left: toRem(24);
  }
}

.withdraw-modal__form {
  margin-top: toRem(40);

  @include respond-to(medium) {
    margin-top: toRem(24);
  }
}
</style>
