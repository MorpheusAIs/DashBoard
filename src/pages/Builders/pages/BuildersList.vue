<template>
  <div class="builders-list">
    <div class="builders-list__hero">
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
      <div class="builders-list__hero-actions">
        <app-button>Stake</app-button>
        <app-button scheme="filled" color="secondary">
          Become a builder
        </app-button>
      </div>
    </div>

    <builders-table />

    <pagination :total-items="100" :current-page="1" />

    <stake-modal :is-shown="false" />
    <builder-form :is-shown="false" />
  </div>
</template>

<script setup lang="ts">
import { AppButton, Pagination } from '@/common'
import BuildersTable from '@/pages/Builders/components/buildersTable.vue'
import StakeModal from '@/pages/Builders/components/StakeModal.vue'
import BuilderForm from '@/pages/Builders/components/BuilderForm.vue'
</script>

<style scoped lang="scss">
.home-page .builders-list.home-page__view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.builders-list__hero {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: toRem(24);
  max-width: toRem(700);
  padding-top: toRem(64);
  padding-bottom: toRem(24);
}

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

.builders-list__hero-actions {
  display: flex;
  gap: toRem(24);
}
</style>
