<template>
  <div class="delegation-description">
    <h1 class="delegation-description__title">
      {{ $t('delegation-description.title') }}
    </h1>
    <div class="delegation-description__text-wrapper">
      <span class="delegation-description__text">
        {{ $t('delegation-description.subtitle-1') }}
      </span>
      <ul class="delegation-description__list">
        <li class="delegation-description__list-item">
          {{ $t('delegation-description.bullet-text-1') }}
        </li>
        <li class="delegation-description__list-item">
          {{ $t('delegation-description.bullet-text-2') }}
        </li>
      </ul>
      <span class="delegation-description__text">
        {{ $t('delegation-description.subtitle-2') }}
      </span>
    </div>
    <app-button
      class="delegation-description__button"
      :text="$t('delegation-description.delegate-button')"
      @click="openDelegateModal"
    />
    <delegate-tokens-modal v-model:is-shown="isModalOpened" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppButton } from '@/common'
import DelegateTokensModal from './DelegateTokensModal.vue'

const isModalOpened = ref(false)

const openDelegateModal = () => {
  isModalOpened.value = true
}
</script>

<style scoped lang="scss">
.delegation-description__text-wrapper {
  display: flex;
  flex-direction: column;
  gap: toRem(12);
  margin: toRem(24) 0;
}

.delegation-description__list {
  list-style: initial;
}

.delegation-description__list-item {
  list-style: initial;
  margin-left: toRem(20);
  line-height: 1.5;
}
</style>
