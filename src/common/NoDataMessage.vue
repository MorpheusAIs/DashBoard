<template>
  <div class="no-data-message">
    <app-icon class="no-data-message__icon" :name="iconName" />
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
    iconName?: ICON_NAMES
  }>(),
  {
    iconName: ICON_NAMES.archive,
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
  color: var(--text-primary-light);
  font-size: toRem(18);
}
</style>
