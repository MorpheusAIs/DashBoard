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
        target="_blank"
        rel="noopener noreferrer"
        text="Show more"
        href="#"
      />
      <div class="info-card__edit-btn-wrp">
        <app-button
          class="info-card__edit-btn"
          scheme="link"
          color="none"
          target="_blank"
          rel="noopener noreferrer"
          :icon-right="$icons.edit"
          href="#"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { InfoCardType } from '@/types'
import AppButton from './AppButton.vue'
import AppIcon from './AppIcon.vue'

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
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
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
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
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
}

.info-card__description {
  $color: #cccccc;

  margin-top: toRem(16);
  color: $color;
  white-space: pre-line;
}

.info-card__address {
  margin-top: auto;

  @include body-3-semi-bold;
}

.info-card__footer {
  display: flex;
  align-items: center;
  border-top: toRem(1) solid #494949;
}

.info-card .info-card__show-more-btn {
  height: toRem(48);
  flex-basis: toRem(286);
}

.info-card__edit-btn-wrp {
  flex-basis: toRem(111);
  border-left: toRem(1) solid #494949;
}

.info-card .info-card__edit-btn {
  height: toRem(48);
  width: 100%;
}
</style>
