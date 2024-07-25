<template>
  <div class="zero-pool-description">
    <ul>
      <li
        v-for="(item, idx) in listItems"
        :key="idx"
        class="zero-pool-description__list-item"
      >
        {{ item }}
      </li>
    </ul>
    <p class="zero-pool-description__details">
      {{ $t('zero-pool-description.details') }}
      <app-button
        class="zero-pool-description__details-link"
        scheme="link"
        target="_blank"
        rel="noopener noreferrer"
        text="GitHub"
        :href="$config.GITHUB_URL"
      />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useI18n } from '@/composables'
import { computed } from 'vue'

const { t } = useI18n()

const listItems = computed<string[]>(() => [
  t('zero-pool-description.list.1'),
  t('zero-pool-description.list.2'),
  // TODO: HIDDEN BEFORE PROD
  // t('zero-pool-description.list.3'),
  t('zero-pool-description.list.4'),
])
</script>

<style lang="scss" scoped>
.zero-pool-description__list-item {
  display: flex;
  align-items: center;
  gap: toRem(8);

  &:before {
    content: '';
    height: toRem(6);
    width: toRem(6);
    background: var(--text-secondary-light);
    border-radius: 50%;
  }
}

.zero-pool-description__details {
  margin: toRem(16) 0 0 toRem(16);
}

.zero-pool-description .zero-pool-description__details-link {
  display: inline-block;
  overflow: unset;

  @include body-3-regular;
}
</style>
