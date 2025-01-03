<template>
  <div class="delegation-info-title">
    <div v-if="Boolean(infoText)" class="delegation-info-title__info-text">
      {{ infoText }}
    </div>
    <div class="delegation-info-title__user-wrapper">
      <h3 v-if="subnet?.name" class="delegation-info-title__username">
        {{ subnet?.name }}
      </h3>
      <div class="delegation-info-title__address-wrapper">
        <h3
          class="delegation-info-title__address"
          :class="{
            'delegation-info-title__address--username': subnet?.name,
          }"
        >
          {{ abbrCenter(String(route.query.subnetAddress), CUT_LENGTH) }}
        </h3>
        <copy-button
          :content="String(route.query.subnetAddress)"
          :message="$t('delegation-info-title.coppied-text')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref } from 'vue'
import { useWeb3ProvidersStore } from '@/store'
import { useI18n } from '@/composables'
import { abbrCenter, fetchSubnet } from '@/helpers'
import { CopyButton } from '@/common'
import { SubnetItem } from '@/types'

const CUT_LENGTH = 5

const { t } = useI18n()
const route = useRoute()
const web3ProvidersStore = useWeb3ProvidersStore()
const subnet = ref<SubnetItem>()
const isYou = computed(
  () =>
    subnet.value?.owner.toLowerCase() ===
    web3ProvidersStore.address.toLowerCase(),
)

const infoText = computed(() => {
  if (isYou.value) {
    return t('delegation-info-title.your-subnet-text')
  }
  return ''
})

const init = async () => {
  subnet.value = (
    await fetchSubnet(
      web3ProvidersStore.networkId,
      route.query.subnetAddress as string,
    )
  ).subnets[0]
}

init()
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
