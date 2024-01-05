<template>
  <div class="app-tabs">
    <component
      v-for="tab in tabs"
      :key="tab.id"
      :is="tab.route ? 'router-link' : 'button'"
      :text="tab.title"
      :to="tab.route"
      class="app-tabs__btn"
      :class="{ 'app-tabs__btn--active': modelValue?.id === tab.id }"
      @click="updateTab(tab)"
    />
  </div>
</template>

<script setup lang="ts">
import { type Tab } from '@/types'

defineProps<{
  modelValue?: Tab
  tabs: Tab[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: Tab): void
}>()

const updateTab = (tab: Tab) => {
  emit('update:modelValue', tab)
}
</script>

<style lang="scss" scoped>
.app-tabs {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  grid-gap: toRem(24);
}

.app-tabs__btn {
  $color: rgba(255, 255, 255, 0.8);

  display: grid;
  align-items: center;
  justify-items: center;
  padding: toRem(16) toRem(24);
  border: toRem(1) solid #494949;
  color: $color;
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &.router-link-active,
  &--active {
    border-color: var(--primary-main);
    color: var(--primary-main);

    @include body-2-semi-bold;
  }

  &:not(.router-link-active):not(.app-tabs__btn--active) {
    &:not([disabled]):hover,
    &:not([disabled]):focus,
    &:not([disabled]):active {
      border-color: var(--primary-main);
      color: var(--primary-main);
    }
  }

  @include body-2-regular;
}
</style>
