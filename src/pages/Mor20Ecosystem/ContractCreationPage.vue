<template>
  <main class="contract-creation-page">
    <div class="contract-creation-page__wrp">
      <app-button
        scheme="link"
        :route="{ name: $routes.appMor20EcosystemMain }"
        :text="$t('mor20-ecosystem.contract-creation-page.back-link')"
        :icon-left="$icons.arrowLeft"
      />
      <transition name="fade" mode="out-in">
        <contract-creation-form
          class="contract-creation-page__form"
          :key="$route.fullPath"
        />
      </transition>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { ContractCreationForm } from '@/forms'
</script>

<style lang="scss" scoped>
.contract-creation-page {
  $z-index: 1;

  position: relative;
  z-index: $z-index;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;

  &:before {
    $z-index: -1;

    position: absolute;
    z-index: $z-index;
    bottom: toRem(-700);
    left: toRem(-700);
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      margin: 0 auto;
      bottom: toRem(-1700);
      left: unset;
      height: toRem(2600);
      width: toRem(2600);
    }
  }

  &:after {
    $z-index: -1;

    position: absolute;
    top: toRem(-440);
    right: toRem(-1030);
    z-index: $z-index;
    content: '';
    display: block;
    height: toRem(1400);
    width: toRem(1400);
    background: radial-gradient(#215244, transparent 60%);

    @include respond-to(medium) {
      display: none;
    }
  }
}

.contract-creation-page__wrp {
  @include page-wrp;
}

.contract-creation-page__form {
  margin-top: toRem(20);
}
</style>
