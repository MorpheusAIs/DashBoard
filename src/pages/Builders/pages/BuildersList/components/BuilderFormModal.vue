<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Become a Builder"
  >
    <div class="mt-8 flex flex-col gap-5">
      <input-field
        placeholder="Builder name"
        model-value=""
        note="What is the name of your project? This is how users will find your project."
      />
      <input-field
        placeholder="Minimum deposit"
        model-value=""
        note="This is the minimum amount of MOR users can deposit when staking to your project."
      />
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

    <div class="mt-10 flex items-center justify-center gap-4">
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

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()
</script>

<style scoped lang="scss"></style>
