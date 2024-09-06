<template>
  <div class="edit-contract">
    <header>
      <contract-info-header
        :name="$t('edit-contract.title')"
        :project-name="contractName"
        :network="network"
      />
    </header>
  </div>
</template>

<script setup lang="ts">
import { CONTRACT_TYPE } from '@/enums'
import { computed } from 'vue'
import { ContractInfoHeader } from './ContractInfo'

const props = defineProps<{
  contractType: CONTRACT_TYPE
  network: string
  projectName?: string
}>()

const contractName = computed(() => {
  if (props.projectName) {
    return props.projectName
  }
  return props.contractType
})
</script>

<style scoped lang="scss">
.edit-contract {
  @include contract-info;
}

.distribution-contract-info__data {
  margin-top: toRem(10);
}

.distribution-contract-info__system-message {
  @include system-message;
}

.edit-contract__name {
  display: flex;
  gap: toRem(8);
  align-items: center;

  @include respond-to(tablet) {
    flex-direction: column;
    align-items: center;
  }
}

.edit-contract__project {
  font-size: toRem(22);
  line-height: toRem(32);
  font-weight: 400;

  @include respond-to(tablet) {
    margin-top: toRem(20);
    font-size: toRem(20);
    text-align: center;
  }
}
</style>
