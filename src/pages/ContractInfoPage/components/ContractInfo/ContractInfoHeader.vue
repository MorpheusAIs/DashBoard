<template>
  <div class="contract-info-header">
    <div class="contract-info-header__name-wrp">
      <div class="contract-info-header__text-name-wrp">
        <h2 class="contract-info-header__name">
          {{ name }}
        </h2>
        <h2
          v-if="symbol"
          class="contract-info-header__name contract-info-header__symbol"
        >
          {{ `(${symbol})` }}
        </h2>
      </div>
      <div class="contract-info-header__title-icon-wrp">
        <app-icon class="contract-info-header__title-icon" :name="iconName" />
        <span class="contract-info-header__icon-description">
          {{ network }}
        </span>
      </div>
    </div>
    <h4 v-if="projectName" class="contract-info-header__project">
      {{ projectName }}
    </h4>
    <p v-if="description" class="contract-info-header__description">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { AppIcon } from '@/common'
import { ETHEREUM_CHAIN_NAMES, ICON_NAMES } from '@/enums'
import { computed } from 'vue'

const props = defineProps<{
  name: string
  network: ETHEREUM_CHAIN_NAMES
  symbol?: string
  projectName?: string
  description?: string
}>()

const iconName = computed(() =>
  props.network === ETHEREUM_CHAIN_NAMES.ethereum ||
  props.network === ETHEREUM_CHAIN_NAMES.sepolia
    ? ICON_NAMES.ethereumAlt
    : ICON_NAMES.arbitrumAlt,
)
</script>

<style scoped lang="scss">
.contract-info-header {
  padding-bottom: toRem(20);
  border-bottom: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );
}

.contract-info-header__name-wrp {
  display: flex;
  gap: toRem(8);
  align-items: center;

  @include respond-to(tablet) {
    flex-direction: column;
    align-items: center;
  }
}

.contract-info-header__text-name-wrp {
  display: flex;
  gap: toRem(8);

  @include respond-to(tablet) {
    width: 100%;
    justify-content: center;
  }
}

.contract-info-header__name {
  font-size: toRem(32);
  line-height: toRem(46);
  font-weight: 700;

  @include respond-to(tablet) {
    font-size: toRem(28);
  }
}

.contract-info-header__symbol {
  color: var(--primary-main);

  @include respond-to(tablet) {
    font-size: toRem(28);
  }
}

.contract-info-header__title-icon-wrp {
  display: flex;
  align-items: center;
  gap: toRem(10);
  padding: toRem(8);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );

  // TODO: ADD COLOR
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 100%
  );
}

.contract-info-header__icon-description {
  font-size: toRem(20);
  line-height: toRem(30);
  text-transform: capitalize;
}

.contract-info-header__title-icon {
  height: toRem(28);
  width: toRem(28);

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(24);
  }
}

.contract-info-header__project {
  font-size: toRem(22);
  line-height: toRem(32);
  font-weight: 400;

  @include respond-to(tablet) {
    margin-top: toRem(20);
    font-size: toRem(20);
    text-align: center;
  }
}

.contract-info-header__description {
  margin-top: toRem(20);
  font-size: toRem(20);
  line-height: toRem(30);
  max-width: toRem(560);

  @include respond-to(tablet) {
    font-size: toRem(18);
    text-align: center;
  }
}
</style>
