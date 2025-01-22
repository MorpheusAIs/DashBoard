<template>
  <div class="contract-info-data">
    <div
      v-for="item in data"
      :key="item.title"
      class="contract-info-data__data"
    >
      <h4 class="contract-info-data__title">
        {{ item.title }}
      </h4>
      <template v-if="Array.isArray(item.value)">
        <div
          v-for="subdata in item.value"
          :key="subdata.title"
          class="contract-info-data__subdata"
        >
          <h5 class="contract-info-data__subdata-title">
            {{ subdata.title }}
          </h5>
          <app-button
            v-if="subdata.link"
            class="contract-info-data__sublink"
            scheme="none"
            size="none"
            target="_blank"
            rel="noopener noreferrer"
            :href="subdata.link"
            :icon-right="$icons.externalLink"
            :text="String(subdata.value)"
          />
          <span v-else class="contract-info-data__subdata-description">
            {{ subdata.value }}
          </span>
        </div>
      </template>
      <app-button
        v-else-if="item.link"
        class="contract-info-data__link"
        scheme="none"
        size="none"
        target="_blank"
        rel="noopener noreferrer"
        :href="item.link"
        :icon-right="$icons.externalLink"
        :text="String(item.value)"
      />
      <span v-else class="contract-info-data__description">
        {{ item.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton } from '@/common'

type ContractInfoData = {
  title: string
  value?: string | number | boolean
  link?: string
}

defineProps<{
  data: {
    title: ContractInfoData['title']
    value?: ContractInfoData['value'] | ContractInfoData[]
    link?: ContractInfoData['link']
  }[]
}>()
</script>

<style scoped lang="scss">
.contract-info-data {
  display: flex;
  flex-direction: column;
  gap: toRem(20);
  max-width: toRem(600);
}

.contract-info-data__title {
  font-size: toRem(18);
  font-weight: 400;
  line-height: 1.5;

  @include respond-to(medium) {
    font-size: toRem(16);
  }
}

.contract-info-data__description {
  font-size: toRem(20);
  font-weight: 600;
  line-height: 1.5;
  text-transform: capitalize;
  display: block;
  max-width: toRem(600);

  @include respond-to(medium) {
    font-size: toRem(18);
  }

  @include text-ellipsis;
}

.contract-info-data__subdata {
  display: flex;
  margin-top: toRem(20);
  flex-direction: column;
  gap: toRem(10);
  padding-left: toRem(20);
}

.contract-info-data__subdata-title {
  position: relative;
  font-size: toRem(16);
  font-weight: 600;
  line-height: 1.5;

  &:before {
    content: '-';
    position: absolute;
    left: toRem(-20);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.contract-info-data__subdata-description {
  font-size: toRem(16);
  font-weight: 400;
  line-height: 1.5;
  text-transform: capitalize;

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}

.contract-info-data__link {
  display: flex;
  gap: toRem(8);
  font-size: toRem(20);
  font-weight: 600;
  line-height: 1.5;
  text-transform: capitalize;
  color: var(--text-secondary-light);
  max-width: 100%;

  &:not([disabled]):focus {
    color: var(--text-secondary-light);
  }

  @include respond-to(medium) {
    font-size: toRem(18);
  }
}

.contract-info-data__sublink {
  display: flex;
  gap: toRem(8);
  font-size: toRem(16);
  font-weight: 600;
  line-height: 1.5;
  text-transform: capitalize;
  color: var(--text-secondary-light);

  &:not([disabled]):focus {
    color: var(--text-secondary-light);
  }

  @include respond-to(medium) {
    font-size: toRem(14);
  }
}
</style>
