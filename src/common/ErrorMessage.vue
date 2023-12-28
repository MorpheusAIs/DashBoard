<template>
  <div class="error-message">
    <icon class="error-message__img" :name="iconName" />
    <h3 v-if="title" class="error-message__title">
      {{ title }}
    </h3>
    <p class="error-message__message">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    title?: string
    message?: string
    schema?: 'large' | 'small'
    iconName?: ICON_NAMES
  }>(),
  {
    title: '',
    message: '',
    schema: 'large',
    iconName: ICON_NAMES.exclamationCircle,
  },
)
</script>

<style lang="scss" scoped>
.error-message {
  display: grid;
  place-items: center;
  text-align: center;
  grid-gap: toRem(12);
}

.error-message__img {
  width: 100%;
  height: auto;
}

.error-message__title {
  font-size: toRem(24);
}

.error-message__message {
  font-size: toRem(18);
}
</style>
