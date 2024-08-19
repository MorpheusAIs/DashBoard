<template>
  <div class="app-tabs">
    <component
      v-for="tab in tabs"
      :key="tab.id"
      :is="tab.route ? 'router-link' : 'a'"
      :to="tab.route"
      :href="tab.href"
      :target="tab.href ? '_blank' : undefined"
      :rel="tab.href ? 'noopener noreferrer' : undefined"
      class="app-tabs__btn"
      :class="{ 'app-tabs__btn--active': modelValue?.id === tab.id }"
      @click="updateTab(tab)"
    >
      {{ tab.title }}
    </component>
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
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  grid-gap: toRem(24);

  @include respond-to(medium) {
    grid-template-columns: 1fr 1fr;
    grid-auto-flow: row;
    grid-gap: toRem(12);
  }
}

.app-tabs__btn {
  $color: rgba(255, 255, 255, 0.8);

  display: grid;
  place-items: center;
  padding: toRem(16) toRem(24);
  border: toRem(1) solid var(--border-tertiary-main);
  color: $color;
  cursor: pointer;
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

  @include respond-to(medium) {
    padding: toRem(12) toRem(16);
  }
}
</style>
