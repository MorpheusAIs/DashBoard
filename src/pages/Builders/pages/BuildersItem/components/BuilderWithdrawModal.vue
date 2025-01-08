<template>
  <basic-modal :is-shown="isShown" title="Withdrawal">
    <div class="mt-8 flex flex-col gap-3">
      <div class="stake-modal__details-row">
        <span class="stake-modal__details-label">Available to Stake</span>
        <span class="stake-modal__details-value">3 667 456.748 MOR</span>
      </div>
    </div>

    <div class="mt-8 flex flex-col gap-5">
      <input-field placeholder="Builder ID" model-value="" />
      <input-field placeholder="MOR amount" model-value="">
        <template #nodeRight>
          <button class="stake-modal__inputs-max-btn" @click="setMaxAmount">
            max
          </button>
        </template>
      </input-field>
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

const setMaxAmount = () => {}
</script>

<style scoped lang="scss">
.stake-modal__details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

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

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}
</style>
