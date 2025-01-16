<template>
  <div class="error-message">
    <app-icon class="error-message__icon" :name="iconName" />
    <h3 v-if="title" class="error-message__title">
      {{ title }}
    </h3>
    <p class="error-message__message">
      {{ shownMessage }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'

import { ICON_NAMES } from '@/enums'
import { useI18n } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    message?: string
    title?: string
    iconName?: ICON_NAMES
  }>(),
  {
    message: '',
    title: '',
    iconName: ICON_NAMES.exclamationCircle,
  },
)

const { t } = useI18n()

const shownMessage = props.message || t('errors.default')
</script>

<style lang="scss" scoped>
.error-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(12);
}

.error-message__icon {
  color: var(--error-main);
  font-size: toRem(48);
}

.error-message__title {
  color: var(--error-main);
  font-size: toRem(24);
}

.error-message__message {
  color: var(--error-main);
  font-size: toRem(18);
}
</style>
