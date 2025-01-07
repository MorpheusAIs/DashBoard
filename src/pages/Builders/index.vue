<template>
  <div class="builders">
    <div class="builders__hero">
      <h2 class="builders__hero-title">Create or Stake in a Builder</h2>
      <span class="builders__hero-desc">
        You can become a Builder or participate in an existing one to start
        earning rewards. When you create a Builder, you can set custom
        parameters including token lock time and reward details. Or you can join
        an existing Builder using your stake Start staking now and claim your
        rewards!
      </span>
      <span class="builders__hero-desc-underline"
        >Start staking now and claim your rewards!</span
      >
      <div class="builders__hero-actions">
        <app-button>Stake</app-button>
        <app-button scheme="filled" color="secondary">
          Become a builder
        </app-button>
      </div>
    </div>

    <builders-table />

    <pagination :total-items="100" :current-page="1" />
  </div>
</template>

<script setup lang="ts">
import { AppButton, Pagination } from '@/common'
import BuildersTable from '@/pages/Builders/components/buildersTable.vue'
</script>

<style scoped lang="scss">
.home-page .builders.home-page__view {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.builders__hero {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  gap: toRem(24);
  max-width: toRem(700);
  padding-top: toRem(64);
  padding-bottom: toRem(24);
}

.builders__hero-title {
  font-size: toRem(54);
  font-weight: 700;
  line-height: toRem(82);
}

.builders__hero-desc {
  font-size: toRem(17);
  line-height: toRem(25.5);
}

.builders__hero-desc-underline {
  text-align: center;
  font-size: toRem(17);
  line-height: toRem(25.5);
  margin-bottom: toRem(8);
}

.builders__hero-actions {
  display: flex;
  gap: toRem(24);
}
</style>
