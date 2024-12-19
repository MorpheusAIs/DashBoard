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
    <div class="delegation-description__buttons">
      <app-button
        class="delegation-description__button"
        :text="$t('delegation-description.stake-button')"
        @click="openDelegateModal"
      />
      <app-button
        class="delegation-description__button"
        :text="$t('delegation-description.become-subnet-button')"
        color="secondary"
        @click="openSubnetModal"
      />
    </div>
    <delegate-tokens-modal v-model:is-shown="isDelegationModalOpened" />
    <delegate-subnet-modal v-model:is-shown="isSubnetModalOpened" />
  </div>
</template>

<script setup lang="ts">
import DelegateTokensModal from './DelegateTokensModal.vue'
import DelegateSubnetModal from './DelegateSubnetModal.vue'

import { ref } from 'vue'
import { AppButton } from '@/common'

const isDelegationModalOpened = ref(false)
const isSubnetModalOpened = ref(false)

const openDelegateModal = () => {
  isDelegationModalOpened.value = true
}

const openSubnetModal = () => {
  isSubnetModalOpened.value = true
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

.delegation-description__buttons {
  display: flex;
  gap: toRem(24);
}
</style>
