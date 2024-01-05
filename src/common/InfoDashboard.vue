<template>
  <div class="info-dashboard">
    <div class="info-dashboard__progress-bar" />
    <ul v-if="items?.length" class="info-dashboard__items">
      <li v-for="(item, idx) in items" :key="idx" class="info-dashboard__item">
        <div class="info-dashboard__item-title-wrp">
          <icon class="info-dashboard__item-icon" :name="item.iconName" />
          <h5 class="info-dashboard__item-title">
            {{ item.title }}
          </h5>
        </div>
        <p class="info-dashboard__item-value">
          {{ item.value }}
        </p>
      </li>
    </ul>
    <div v-if="$slots.default" class="info-dashboard__slot-wrp">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { type InfoDashboardType } from '@/types'

defineProps<{
  items?: InfoDashboardType.Item[]
}>()
</script>

<style lang="scss" scoped>
.info-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: toRem(50) toRem(20) toRem(30);
  height: max-content;
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    -84deg,
    rgba(255, 255, 255, 0.48),
    rgba(255, 255, 255, 0.08)
  );
  background: linear-gradient(
      -84deg,
      rgba(57, 99, 58, 0.04),
      rgba(38, 57, 57, 0.5)
    )
    padding-box;
}

.info-dashboard__progress-bar {
  height: toRem(156);
  width: toRem(156);
  border: toRem(12) solid;
  border-radius: 50%;
  background: linear-gradient(158.09deg, #ffffff 14.34%, #fbc969 83.65%);
}

.info-dashboard__items {
  margin-top: toRem(24);
  width: 100%;
  display: grid;
  grid-gap: toRem(8);
}

.info-dashboard__item {
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  grid-gap: toRem(24);
}

.info-dashboard__item-title-wrp {
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: toRem(8);
}

.info-dashboard__item-icon {
  height: toRem(24);
  width: toRem(24);
}

.info-dashboard__item-title {
  @include body-3-regular;
}

.info-dashboard__item-value {
  text-align: right;

  @include body-3-semi-bold;

  @include text-ellipsis;
}

.info-dashboard__slot-wrp {
  margin-top: toRem(24);

  .info-dashboard__items + & {
    margin-top: toRem(28);
  }
}
</style>
