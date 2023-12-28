<template>
  <div class="no-data-message">
    <icon class="no-data-message__img" :name="iconName" />
    <span v-if="message" class="no-data-message__message">
      {{ message }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'

import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    message?: string
    iconName?: ICON_NAMES
  }>(),
  { message: '', iconName: ICON_NAMES.template },
)
</script>

<style lang="scss" scoped>
.no-data-message {
  display: grid;
  place-items: center;
  text-align: center;
  grid-gap: toRem(12);
}

.no-data-message__img {
  width: 100%;
  height: auto;
}

.no-data-message__message {
  font-size: toRem(18);
}
</style>
