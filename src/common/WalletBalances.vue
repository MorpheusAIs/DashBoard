<template>
  <select-field v-model="currentBalance" class="wallet-balances">
    <template #head>
      <div
        v-tooltip="`${currentBalance.value} ${currentBalance.tokenTitle}`"
        class="wallet-balances__current-balance"
      >
        <icon
          class="wallet-balances__balance-logo"
          :class="[
            `wallet-balances__balance-logo--${currentBalance.logoIconName}`,
          ]"
          :name="currentBalance.logoIconName"
        />
        <span class="wallet-balances__balance-value">
          {{ currentBalance.value }}
        </span>
      </div>
    </template>
    <template #default="{ selectField }">
      <button
        v-for="(balance, idx) in mockBalances"
        :key="idx"
        class="wallet-balances__balance"
        @click="selectField.select(balance)"
      >
        <icon
          class="wallet-balances__balance-logo"
          :class="[`wallet-balances__balance-logo--${balance.logoIconName}`]"
          :name="balance.logoIconName"
        />
        <span class="wallet-balances__balance-value">
          {{ `${balance.value} ${balance.tokenTitle}` }}
        </span>
        <icon
          class="wallet-balances__balance-token-icon"
          :name="balance.tokenIconName"
        />
      </button>
    </template>
  </select-field>
</template>

<script lang="ts" setup>
import { ICON_NAMES } from '@/enums'
import { SelectField } from '@/fields'
import Icon from './Icon.vue'
import { ref } from 'vue'

type Balance = {
  logoIconName: ICON_NAMES
  value: string
  tokenTitle: string
  tokenIconName: ICON_NAMES
}

const mockBalances: Balance[] = [
  {
    logoIconName: ICON_NAMES.steth,
    value: '163.894',
    tokenTitle: 'stETH',
    tokenIconName: ICON_NAMES.ethereum,
  },
  {
    logoIconName: ICON_NAMES.morpheus,
    value: '12 546.894',
    tokenTitle: 'MOR',
    tokenIconName: ICON_NAMES.arbitrum,
  },
]

const currentBalance = ref<Balance>(mockBalances[0])
</script>

<style lang="scss" scoped>
.wallet-balances {
  height: toRem(48);
  background: var(--background-secondary-main);
  width: toRem(160);

  :deep(.select-field__select-head-indicator) {
    right: toRem(10);
  }

  :deep(.select-field__select-drop-menu) {
    top: 120%;

    @include respond-to(small) {
      left: unset;
      right: 0;
    }
  }
}

.wallet-balances__current-balance {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: toRem(12) toRem(6) toRem(12) toRem(16);
  color: var(--text-secondary-light);
}

.wallet-balances__balance {
  display: flex;
  align-items: center;
  padding: toRem(12) toRem(16);
  color: var(--text-secondary-light);
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &:not([disabled]):hover,
  &:not([disabled]):focus,
  &:not([disabled]):active {
    background: var(--primary-main);
    color: var(--text-primary-dark);
  }
}

.wallet-balances__balance-logo {
  margin-right: toRem(12);
  height: toRem(26);
  width: toRem(20);

  &--steth {
    $color: #00a3ff;

    color: $color;
  }

  &--morpheus {
    $color: #ffffff;

    color: $color;
  }
}

.wallet-balances__balance-value {
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

.wallet-balances .wallet-balances__balance-token-icon {
  margin-left: toRem(6);
  height: toRem(20);
  width: toRem(20);
  color: inherit;
}
</style>
