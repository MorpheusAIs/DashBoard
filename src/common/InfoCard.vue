<template>
  <div class="info-card" :class="{ 'info-card--loading': isLoading }">
    <div class="info-card__content">
      <div class="info-card__title-wrp">
        <h4 class="info-card__title">
          {{ card.title }}
        </h4>
        <div class="info-card__title-icon-wrp">
          <app-icon class="info-card__title-icon" :name="card.icon" />
        </div>
      </div>
      <p class="info-card__description">
        {{ card.description }}
      </p>
      <app-button
        class="info-card__address"
        scheme="link"
        color="none"
        target="_blank"
        rel="noopener noreferrer"
        :text="card.address"
        :icon-right="$icons.externalLink"
        :href="card.link"
      />
    </div>
    <div class="info-card__footer">
      <app-button
        class="info-card__show-more-btn"
        scheme="link"
        color="none"
        :route="{
          name: $routes.contractInfo,
          query: {
            contractAddress: card.address,
            type: CONTRACT_INFO_ACTIONS.read,
          },
        }"
        :text="$t('info-card.show-more')"
      />
      <div class="info-card__edit-btn-wrp">
        <app-button
          class="info-card__edit-btn"
          scheme="link"
          color="none"
          :icon-right="$icons.edit"
          :route="{
            name: $routes.contractInfo,
            query: {
              contractAddress: card.address,
              type: CONTRACT_INFO_ACTIONS.edit,
            },
          }"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type InfoCardType } from '@/types'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'
import { CONTRACT_INFO_ACTIONS } from '@/enums'

withDefaults(
  defineProps<{
    card: InfoCardType.Card
    isLoading?: boolean
  }>(),
  {
    isLoading: false,
  },
)
</script>

<style lang="scss" scoped>
.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 100%
  );

  &--loading {
    &:before {
      $z-index: 2;

      z-index: $z-index;
    }

    @include skeleton;

    border-radius: 0;
  }
}

.info-card__content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: toRem(20) toRem(20) toRem(24);

  @include respond-to(medium) {
    padding: toRem(16) toRem(16) toRem(20);
  }
}

.info-card__title-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-card__title {
  color: var(--primary-main);
}

.info-card__title-icon-wrp {
  padding: toRem(8);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 100%
  );
}

.info-card__title-icon {
  height: toRem(28);
  width: toRem(28);

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(24);
  }
}

.info-card__description {
  $color: #cccccc;

  margin-top: toRem(16);
  color: $color;
  white-space: pre-line;
}

.info-card .info-card__address {
  display: grid;
  width: 100%;
  grid-auto-flow: column;
  margin-top: auto;
  justify-content: start;

  @include body-3-semi-bold;
}

.info-card__footer {
  display: flex;
  align-items: center;
  border-top: toRem(1) solid var(--border-tertiary-main);
}

.info-card .info-card__show-more-btn {
  height: toRem(48);
  flex: 1 toRem(286);
}

.info-card__edit-btn-wrp {
  flex-basis: toRem(111);
  border-left: toRem(1) solid var(--border-tertiary-main);
}

.info-card .info-card__edit-btn {
  height: toRem(48);
  width: 100%;
}
</style>
