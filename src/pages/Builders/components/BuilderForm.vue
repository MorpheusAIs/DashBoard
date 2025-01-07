<template>
  <basic-modal :is-shown="isShown" title="Become a Builder">
    <div class="builder-form__inputs">
      <input-field placeholder="Builder name" model-value="" />
      <input-field placeholder="Minimum deposit" model-value="" />
      <input-field
        placeholder="Lock period after stake"
        note="After each stake, the user will not be able to withdraw their tokens for that period"
        model-value=""
      />
      <datetime-field
        placeholder="Start time"
        note="It will be possible to change the Builder settings up to this point. The stake will not be available until this time"
        model-value=""
      />
      <datetime-field
        placeholder="Claim lock ends"
        note="After this period, the creator (owner) of the Builder will be able to claim the rewards"
        model-value=""
      />
    </div>

    <div class="builder-form__actions">
      <app-button scheme="filled" color="secondary"> Cancel </app-button>
      <app-button>Confirm</app-button>
    </div>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal } from '@/common'
import { InputField, DatetimeField } from '@/fields'

withDefaults(
  defineProps<{
    isShown?: boolean
  }>(),
  {
    isShown: true,
  },
)
</script>

<style scoped lang="scss">
.builder-form__inputs {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  margin-top: toRem(32);
}

.builder-form__actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(16);
  margin-top: toRem(40);
}

.builder-form__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}
</style>
