<template>
  <select-field v-model="network" class="network-switch">
    <template #head>
      <div class="network-switch__head-wrp">
        <span class="network-switch__network">
          {{ network.title }}
        </span>
      </div>
    </template>
    <template #default="{ selectField }">
      <button
        v-for="(networkOption, idx) in networkOptions"
        :key="idx"
        class="network-switch__network-option"
        @click="selectField.select(networkOption)"
      >
        <span class="network-switch__network-option-text">
          {{ networkOption.title }}
        </span>
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { SelectField } from '@/fields'
import { type FieldOption } from '@/types'
import { computed, ref } from 'vue'

const { $t } = useContext()

const networkOptions = computed<FieldOption<string>[]>(() => [
  {
    title: $t('network-switch.mainnet'),
    value: $t('network-switch.mainnet'),
  },
  {
    title: $t('network-switch.testnet'),
    value: $t('network-switch.testnet'),
  },
])

const network = ref(networkOptions.value[0])
</script>

<style lang="scss" scoped>
.network-switch {
  background: var(--background-secondary-main);
  height: toRem(48);
  width: toRem(220);

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }
}

.network-switch__head-wrp {
  display: flex;
  align-items: center;
  height: 100%;
}

.network-switch__network {
  padding: 0 toRem(6) 0 toRem(16);
  color: var(--text-secondary-light);

  @include text-ellipsis;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}

.network-switch__network-option {
  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);
  text-align: left;

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: var(--primary-main);
    color: var(--text-primary-dark);
  }
}

.network-switch__network-option-text {
  color: inherit;

  @include text-ellipsis;

  @include respond-to(medium) {
    font-family: var(--app-font-family);
    font-size: toRem(18);
    font-weight: 400;
    line-height: toRem(26);
    letter-spacing: 0;
  }
}
</style>
