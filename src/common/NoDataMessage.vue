<template>
  <div class="no-data-message">
    <app-icon v-if="iconName" class="no-data-message__icon" :name="iconName" />
    <svg v-else class="no-data-message__illustration">
      <use href="/branding/no-data-message-illustration.svg#ndm" />
    </svg>
    <span class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'
import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    message?: string
    iconName?: ICON_NAMES | null
  }>(),
  {
    iconName: null,
    message: '',
  },
)
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(12);
}

.no-data-message__icon {
  color: var(--text-primary-light);
  font-size: toRem(48);
}

.no-data-message__message {
  font-size: toRem(28);
  font-weight: 700;
}

.no-data-message__illustration {
  width: toRem(188);
  height: toRem(140);
}
</style>
