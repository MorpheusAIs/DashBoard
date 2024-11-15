<template>
  <div class="referees-list-navigation">
    <div class="referees-list-navigation__cel">
      <span class="referees-list-navigation__cel-text">
        {{ $t('referees-list.address-text') }}
      </span>
    </div>
    <div class="referees-list-navigation__cel">
      <span class="referees-list-navigation__cel-text">
        {{ $t('referees-list.deposited-text') }}
      </span>
      <div class="referees-list-navigation__buttons">
        <app-button
          class="referees-list-navigation__button"
          size="none"
          scheme="link"
          @click="emit('sort', SORTING_ORDER.asc)"
        >
          <app-icon
            class="referees-list-navigation__button-icon"
            :class="{
              'referees-list-navigation__button-icon--active':
                sorting === SORTING_ORDER.asc,
            }"
            :name="$icons.triangleTop"
          />
        </app-button>
        <app-button
          class="referees-list-navigation__button"
          size="none"
          scheme="link"
          @click="emit('sort', SORTING_ORDER.desc)"
        >
          <app-icon
            class="referees-list-navigation__button-icon"
            :class="{
              'referees-list-navigation__button-icon--active':
                sorting === SORTING_ORDER.desc,
            }"
            :name="$icons.triangleTop"
          />
        </app-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppButton, AppIcon } from '@/common'
import { SORTING_ORDER } from '@/enums'

defineProps<{
  sorting: SORTING_ORDER
}>()

const emit = defineEmits<{
  (e: 'sort', SORTING_ORDER): void
}>()
</script>

<style scoped lang="scss">
.referees-list-navigation {
  display: grid;
  grid-template-columns: toRem(48) minmax(max-content, 1fr) toRem(150);
  gap: toRem(32);
  padding: toRem(24) toRem(48);

  @include respond-to(small) {
    grid-template-columns: toRem(20) minmax(max-content, 1fr) toRem(100);
  }
}

.referees-list-navigation__cel {
  display: flex;
  gap: toRem(12);
  align-items: center;

  &:first-child {
    grid-column: 2;
  }

  &:last-child {
    margin-left: auto;
  }
}

.referees-list-navigation__cel-text {
  font-size: toRem(16);
  color: var(--text-tertiary-main);

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.referees-list-navigation__buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.referees-list-navigation__button {
  &:nth-child(2) {
    transform: rotate(180deg);
  }
}

.referees-list-navigation__button-icon {
  width: toRem(10);
  height: toRem(5);
  color: var(--background-tertiary-light);

  &--active {
    color: var(--primary-main);
  }
}
</style>
