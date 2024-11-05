<template>
  <div
    class="info-indicator"
    :class="{
      'info-indicator--loading': isLoading,
    }"
  >
    <div class="info-indicator__title-wrp">
      <app-icon v-if="iconName" class="info-indicator__icon" :name="iconName" />
      <h5
        class="info-indicator__title"
        :class="{ 'info-indicator__title--margin': !iconName }"
      >
        {{ title }}
      </h5>
    </div>
    <div v-if="link" class="info-indicator__link-wrp">
      <app-button
        class="info-indicator__link-text"
        scheme="link"
        size="none"
        target="_blank"
        rel="noopener noreferrer"
        :href="link"
        :text="value"
      />
      <copy-button
        class="info-indicator__link-copy-button"
        :content="link"
        :message="$t('info-indicator.coppied-text')"
      />
    </div>
    <p v-else class="info-indicator__value">
      {{ value || '-' }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { AppButton, AppIcon, CopyButton } from '@/common'

defineProps<{
  title: string
  value: string | number
  isLoading: boolean
  iconName?: string
  link?: string
}>()
</script>

<style lang="scss" scoped>
.info-indicator {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(24);

  @include respond-to(medium) {
    grid-gap: toRem(16);
  }
}

.info-indicator__title-wrp {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: toRem(8);

  .info-indicator--loading & {
    height: toRem(26);
    width: 100%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(20);
    }
  }

  @include respond-to(medium) {
    grid-gap: toRem(4);
  }
}

.info-indicator__icon {
  height: toRem(24);
  width: toRem(24);

  @include respond-to(medium) {
    height: toRem(20);
    width: toRem(20);
  }
}

.info-indicator__title {
  @include body-3-regular;

  &--margin {
    margin-left: toRem(32);
  }
}

.info-indicator__value {
  justify-self: end;

  .info-indicator--loading & {
    height: toRem(26);
    width: 100%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(20);
    }
  }

  @include body-3-semi-bold;

  @include text-ellipsis;
}

.info-indicator__link-wrp {
  display: flex;
  margin-left: auto;
  align-items: center;
  gap: toRem(8);
}

.info-indicator__link-text {
  font-weight: 600;
}

.info-indicator__link-copy-button {
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.5;
  }
}
</style>
