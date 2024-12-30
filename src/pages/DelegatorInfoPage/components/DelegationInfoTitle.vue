<template>
  <div class="delegation-info-title">
    <div v-if="Boolean(infoText)" class="delegation-info-title__info-text">
      {{ infoText }}
    </div>
    <div class="delegation-info-title__user-wrapper">
      <h3 v-if="username" class="delegation-info-title__username">
        {{ username }}
      </h3>
      <div class="delegation-info-title__address-wrapper">
        <h3
          class="delegation-info-title__address"
          :class="{
            'delegation-info-title__address--username': username,
          }"
        >
          {{ abbrCenter(route.query.subnetAddress, CUT_LENGTH) }}
        </h3>
        <copy-button
          :content="route.query.subnetAddress"
          :message="$t('delegation-info-title.coppied-text')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { useI18n } from '@/composables'
import { abbrCenter } from '@/helpers'
import { CopyButton } from '@/common'

const CUT_LENGTH = 5
const MOCKED_USERNAMES = {
  '0xbD66AD8376415edD7F4eE0fDE32E759A763989E9': 'Sorizen',
}

const { t } = useI18n()
const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const isYou = computed(
  () =>
    String(route.query.subnetAddress).toLowerCase() ===
    web3ProvidersStore.address.toLowerCase(),
)

const infoText = computed(() => {
  if (isYou.value) {
    return t('delegation-info-title.your-subnet-text')
  }
  return ''
})

const username = computed(
  () => MOCKED_USERNAMES[route.query.subnetAddress] ?? '',
)
</script>

<style scoped lang="scss">
.delegation-info-title__info-text {
  padding: toRem(4) toRem(12);
  background: var(--primary-main);
  width: fit-content;
  font-weight: 500;
}

.delegation-info-title__address-wrapper {
  display: flex;
  gap: toRem(16);
  align-items: center;
}

.delegation-info-title__username,
.delegation-info-title__address {
  font-weight: 700;
  font-size: toRem(54);
  line-height: 1.5;
}

.delegation-info-title__address {
  &--username {
    font-size: toRem(24);
    font-weight: 400;
  }
}
</style>
