<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Stake MOR"
  >
    <div class="mt-8 flex flex-col gap-5">
      <div class="flex flex-col items-end gap-3">
        <input-field placeholder="MOR amount" model-value="">
          <template #nodeRight>
            <button class="stake-modal__inputs-max-btn" @click="setMaxAmount">
              max
            </button>
          </template>
        </input-field>

        <div class="flex items-center justify-between gap-2">
          <span class="stake-modal__details-label">Available to Stake</span>
          <span class="stake-modal__details-value">3 667 456.748 MOR</span>
        </div>
      </div>
    </div>

    <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
      <div
        class="flex items-center justify-between"
        v-for="(el, i) in builderDetails.slice(0, 3)"
        :key="i"
      >
        <span class="text-textSecondaryMain typography-body3">
          {{ el.label }}
        </span>
        <span class="font-bold text-textSecondaryMain typography-body3">
          {{ el.value }}
        </span>
      </div>

      <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

      <div
        class="flex items-center justify-between"
        v-for="(el, i) in builderDetails.slice(3)"
        :key="i"
      >
        <span class="text-textSecondaryMain typography-body3">
          {{ el.label }}
        </span>
        <span class="font-bold text-textSecondaryMain typography-body3">
          {{ el.value }}
        </span>
      </div>
    </div>

    <div class="mt-10 flex items-center justify-center gap-4">
      <app-button scheme="filled" color="secondary"> Cancel </app-button>
      <app-button>Confirm</app-button>
    </div>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal } from '@/common'
import { InputField } from '@/fields'

withDefaults(
  defineProps<{
    isShown?: boolean
  }>(),
  {
    isShown: true,
  },
)

const builderDetails = [
  {
    label: 'Builder',
    value: 'Venice',
  },
  {
    label: 'Min Deposit',
    value: '25.0 MOR',
  },
  {
    label: 'Lock Period',
    value: '30 Days',
  },
  {
    label: 'New Stake Amount',
    value: '0.0 MOR',
  },
  {
    label: 'New Unlock Date',
    value: 'Mar 26, 2025 at 13:00',
  },
]

const setMaxAmount = () => {}

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()
</script>

<style scoped lang="scss">
.stake-modal__details-label {
  font-size: toRem(20);
  font-weight: 400;
  line-height: toRem(30);
}

.stake-modal__details-value {
  text-align: right;
  font-size: toRem(20);
  font-weight: 700;
  line-height: toRem(30);
}

.stake-modal__callout-text {
  font-size: toRem(20);
  line-height: toRem(30);
}

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}
</style>
