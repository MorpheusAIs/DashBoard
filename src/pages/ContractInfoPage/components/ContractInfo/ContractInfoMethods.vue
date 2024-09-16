<template>
  <div class="contract-info-methods">
    <div class="contract-info-methods__content">
      <app-button
        v-for="method in methods"
        class="contract-info-methods__button"
        :class="{
          'contract-info-methods__button--active': method === chosenMethod,
        }"
        modification="border-circle"
        scheme="flat"
        :key="method"
        :text="method"
        @click="chooseMethod(method)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ContractMethods } from '@/types'
import { AppButton } from '@/common'

defineProps<{
  chosenMethod: ContractMethods
  methods: ContractMethods[]
}>()

const emit = defineEmits<{
  (e: 'choose-method', v: ContractMethods): void
}>()

const chooseMethod = (method: ContractMethods) => {
  emit('choose-method', method)
}
</script>

<style scoped lang="scss">
.contract-info-methods {
  max-height: 50vh;
  overflow-y: auto;
}

.contract-info-methods__content {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
  margin-right: toRem(40);

  @include respond-to(medium) {
    margin: 0;
  }
}

.contract-info-methods__button {
  font-weight: 400;
  width: toRem(275);
  text-transform: capitalize;
  color: var(--text-tertiary-main);

  &--active {
    color: var(--primary-main);
    border-color: var(--primary-main);

    &:not([disabled]):hover,
    &:not([disabled]):focus,
    &:not([disabled]):active {
      border-color: var(--primary-main);
    }
  }

  @include respond-to(medium) {
    width: 100%;
  }
}
</style>
