<template>
  <div class="info-bar" :class="{ 'info-bar--loading': isLoading }">
    <div class="info-bar__subtitle-wrp">
      <p class="info-bar__subtitle">
        {{ subtitle }}
      </p>
      <p class="info-bar__status" :class="[`info-bar__status--${status}`]">
        {{ $t(`info-bar.status--${status}`) }}
      </p>
    </div>
    <h1>{{ title }}</h1>
    <div class="info-bar__description-wrp">
      <template v-if="$slots.description">
        <slot name="description" />
      </template>
      <template v-else>
        <p>{{ description }}</p>
      </template>
    </div>
    <ul v-if="indicators.length" class="info-bar__indicators">
      <li
        v-for="(indicator, idx) in indicators"
        :key="idx"
        class="info-bar__indicator"
      >
        <div class="info-bar__indicator-title-wrp">
          <h5 class="info-bar__indicator-title">
            {{ indicator.title }}
          </h5>
          <app-icon
            v-if="indicator.note"
            v-tooltip="indicator.note"
            class="info-bar__indicator-note"
            :name="$icons.exclamationCircle"
          />
        </div>
        <p class="info-bar__indicator-value">
          {{ indicator.value || '-' }}
        </p>
      </li>
    </ul>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { type InfoBarType } from '@/types'
import AppIcon from './AppIcon.vue'

withDefaults(
  defineProps<{
    subtitle: string
    status: 'public' | 'private'
    title: string
    description: string
    indicators: InfoBarType.Indicator[]
    isLoading?: boolean
  }>(),
  { isLoading: false },
)
</script>

<style lang="scss" scoped>
.info-bar__subtitle-wrp {
  display: flex;
  align-items: center;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-bottom: toRem(8);
    gap: toRem(8);
  }
}

.info-bar__subtitle {
  text-transform: uppercase;

  @include body-2-regular;
}

.info-bar__status {
  $color: #15151d;

  color: $color;
  padding: toRem(4) toRem(12);

  &--public {
    background: var(--primary-main);
  }

  &--private {
    background: linear-gradient(90deg, #e08c5c 0%, #ffbe72 100%);
  }

  .info-bar--loading & {
    @include skeleton;
  }

  @include respond-to(medium) {
    padding: toRem(2) toRem(14);
  }
}

.info-bar__description-wrp {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.info-bar__indicators {
  margin-top: toRem(24);
  display: grid;
  grid-gap: toRem(8);
  padding-top: toRem(16);
  border-top: toRem(2) solid #494949;

  @include respond-to(medium) {
    margin-top: toRem(16);
    grid-gap: toRem(10);
  }
}

.info-bar__indicator {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(24);

  @include respond-to(medium) {
    grid-gap: toRem(16);
  }
}

.info-bar__indicator-title-wrp {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: toRem(4);

  .info-bar--loading & {
    height: toRem(26);
    width: 100%;

    @include skeleton;

    @include respond-to(medium) {
      height: toRem(20);
    }
  }
}

.info-bar__indicator-title {
  @include body-4-regular;
}

.info-bar .info-bar__indicator-note {
  $color: #cccccc;

  color: $color;
  height: toRem(20);
  width: toRem(20);
  pointer-events: unset;
  transition: var(--transition-duration-fast) var(--transition-timing-default);

  &:hover {
    color: var(--text-secondary-light);
  }
}

.info-bar__indicator-value {
  justify-self: end;

  .info-bar--loading & {
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
</style>
