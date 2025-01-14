<template>
  <div class="error-message">
    <app-icon v-if="iconName" class="error-message__icon" :name="iconName" />
    <svg v-else class="error-message__illustration">
      <use href="/branding/no-data-message-illustration.svg#ndm" />
    </svg>
    <h3 v-if="title" class="error-message__title">
      {{ title }}
    </h3>
    <p class="error-message__message">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'

import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    message: string
    title?: string
    iconName?: ICON_NAMES
  }>(),
  {
    title: '',
    iconName: undefined,
  },
)
</script>

<style lang="scss" scoped>
.error-message__illustration {
  width: toRem(188);
  height: toRem(140);
}

.error-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(14);
}

.error-message__icon {
  color: var(--error-main);
  font-size: toRem(48);
}

.error-message__title {
  @apply text-textSecondaryMain;

  font-size: toRem(24);
}

.error-message__message {
  @apply text-textTertiaryMain;

  font-size: toRem(20);
}
</style>
