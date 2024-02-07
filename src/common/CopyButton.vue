<template>
  <vDropdown
    theme="tooltip"
    :triggers="[]"
    :shown="isCopied"
    :auto-hide="false"
  >
    <button class="copy-button" @click="copyToClipboard">
      <app-icon class="copy-button__icon" :name="$icons.copy" />
    </button>
    <template #popper>
      <span>{{ message }}</span>
    </template>
  </vDropdown>
</template>

<script lang="ts" setup>
import { ErrorHandler } from '@/helpers'
import { useClipboard } from '@vueuse/core'
import AppIcon from './AppIcon.vue'

const props = defineProps<{
  content: string
  message: string
}>()

const { copy: _copy, copied: isCopied } = useClipboard()

const copyToClipboard = async () => {
  try {
    await _copy(props.content)
  } catch (error) {
    ErrorHandler.process(error)
  }
}
</script>

<style lang="scss" scoped>
.copy-button {
  display: block;
}

.copy-button__icon {
  height: toRem(24);
  width: toRem(24);
  color: var(--primary-main);
}
</style>
