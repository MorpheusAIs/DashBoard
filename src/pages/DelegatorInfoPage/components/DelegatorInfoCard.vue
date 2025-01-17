<script setup lang="ts">
import { DelegationUserCard } from '@/types'
import { AppButton } from '@/common'

const emit = defineEmits<{
  (e: 'modal-button-click'): void
}>()

defineProps<{
  card: DelegationUserCard
}>()
</script>

<template>
  <div class="delegator-info-card">
    <div class="delegator-info-card__header">
      <p class="delegator-info-card__title">
        {{ card.title }}
      </p>
      <app-button
        v-if="card?.buttonText"
        class="delegator-info-card__button"
        size="small"
        :text="card.buttonText"
        @click="emit('modal-button-click')"
      />
    </div>
    <p class="delegator-info-card__amount">
      {{ card.amount }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.delegator-info-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: var(--card-border-gradient);
  background: var(--card-background-gradient);
  padding: toRem(24);
  gap: toRem(32);
}

.delegator-info-card__header {
  display: flex;
  justify-content: space-between;
  gap: toRem(24);
}

.delegator-info-card__amount {
  font-weight: 700;
  font-size: toRem(32);
}

.delegator-info-card__button {
  min-width: toRem(104);
}
</style>
