<template>
  <div class="flex w-full flex-col items-center">
    <div
      class="flex max-w-[700px] flex-col items-center justify-center gap-6 pb-6 pt-16 text-center"
    >
      <h2 class="builders-list__hero-title">Create or Stake in a Builder</h2>
      <span class="builders-list__hero-desc">
        You can become a Builder or participate in an existing one to start
        earning rewards. When you create a Builder, you can set custom
        parameters including token lock time and reward details. Or you can join
        an existing Builder using your stake Start staking now and claim your
        rewards!
      </span>
      <span class="builders-list__hero-desc-underline">
        Start staking now and claim your rewards!
      </span>
      <div class="flex items-center gap-6">
        <app-button>Stake</app-button>
        <app-button scheme="filled" color="secondary">
          Become a builder
        </app-button>
      </div>
    </div>

    <builders-table class="mt-16" />

    <pagination :total-items="100" :current-page="1" class="mt-6" />

    <builders-stake-modal :is-shown="false" />
    <builder-form-modal :is-shown="false" />
  </div>
</template>

<script setup lang="ts">
import { AppButton, Pagination } from '@/common'
import BuildersTable from '@/pages/Builders/pages/BuildersList/components/BuildersTable.vue'
import BuilderFormModal from '@/pages/Builders/pages/BuildersList/components/BuilderFormModal.vue'
import BuildersStakeModal from '@/pages/Builders/pages/BuildersList/components/BuildersStakeModal.vue'

defineOptions({
  inheritAttrs: false,
})
</script>

<style scoped lang="scss">
.builders-list__hero-title {
  font-size: toRem(54);
  font-weight: 700;
  line-height: toRem(82);
}

.builders-list__hero-desc {
  font-size: toRem(17);
  line-height: toRem(25.5);
}

.builders-list__hero-desc-underline {
  text-align: center;
  font-size: toRem(17);
  line-height: toRem(25.5);
  margin-bottom: toRem(8);
}
</style>
