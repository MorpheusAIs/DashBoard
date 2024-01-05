<template>
  <div class="info-bar">
    <div class="info-bar__subtitle-wrp">
      <p class="info-bar__subtitle">
        {{ subtitle }}
      </p>
      <p class="info-bar__status" :class="[`info-bar__status--${status}`]">
        {{ $t(`info-bar.status--${status}`) }}
      </p>
    </div>
    <h1>{{ title }}</h1>
    <p class="info-bar__description">
      {{ description }}
    </p>
    <ul v-if="items.length" class="info-bar__items">
      <li v-for="(item, idx) in items" :key="idx" class="info-bar__item">
        <div class="info-bar__item-title-wrp">
          <h5 class="info-bar__item-title">
            {{ item.title }}
          </h5>
          <icon
            v-if="item.note"
            class="info-bar__item-note"
            :name="$icons.exclamationCircle"
          />
        </div>
        <p class="info-bar__item-value">
          {{ item.value }}
        </p>
      </li>
    </ul>
    <div v-if="$slots.default" class="info-bar__slot-wrp">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { type InfoBarType } from '@/types'

defineProps<{
  subtitle: string
  status: 'public' | 'private'
  title: string
  description: string
  items: InfoBarType.Item[]
}>()
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

  @include respond-to(medium) {
    padding: toRem(2) toRem(14);
  }
}

.info-bar__description {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.info-bar__items {
  margin-top: toRem(24);
  display: grid;
  grid-gap: toRem(8);
  padding-top: toRem(16);
  border-top: toRem(2) solid #494949;

  &:not(:last-child) {
    padding-bottom: toRem(16);
    border-bottom: toRem(2) solid #494949;
  }

  @include respond-to(medium) {
    margin-top: toRem(16);
    grid-gap: toRem(10);
  }
}

.info-bar__item {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(24);

  @include respond-to(medium) {
    grid-gap: toRem(16);
  }
}

.info-bar__item-title-wrp {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: toRem(4);
}

.info-bar__item-title {
  @include body-4-regular;
}

.info-bar__item-note {
  $color: #cccccc;

  color: $color;
  height: toRem(20);
  width: toRem(20);
}

.info-bar__item-value {
  text-align: right;

  @include body-3-semi-bold;

  @include text-ellipsis;
}

.info-bar__slot-wrp {
  margin-top: toRem(30);

  @include respond-to(medium) {
    margin-top: toRem(32);
  }
}
</style>
