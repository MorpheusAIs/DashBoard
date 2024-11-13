<script setup lang="ts">
import { AppButton } from '@/common/index'
import { NavButton, Paginate } from '@brutforce/vue3-paginate'
</script>

<template>
  <paginate
    class="pagination"
    wrapper-classes="pagination__list"
    dot-classes="pagination__dots"
    page-classes="pagination__page-button"
    active-page-classes="pagination__page-button--active"
    :per-page="1"
    :total-pages="25"
    :current-page="1"
    :max-pages="3"
  >
    <template #prev>
      <nav-button page="prev">
        <app-button
          class="pagination__navigation-button"
          size="none"
          scheme="none"
          :icon-right="$icons.chevronDown"
        />
      </nav-button>
    </template>

    <template #next>
      <nav-button page="next">
        <app-button
          :class="
            [
              'pagination__navigation-button',
              'pagination__navigation-button--next',
            ].join(' ')
          "
          size="none"
          scheme="none"
          :icon-right="$icons.chevronDown"
        />
      </nav-button>
    </template>
  </paginate>
</template>

<style scoped lang="scss">
.pagination {
  display: flex;
  gap: toRem(5);

  :deep(.pagination__list) {
    ul {
      display: flex;
      flex-direction: row;
      gap: toRem(5);
    }
  }

  :deep(.pagination__dots) {
    width: toRem(32);
    height: toRem(32);
    color: var(--text-secondary-light);

    svg {
      max-width: toRem(11);
    }
  }

  :deep(.pagination__page-button) {
    width: toRem(32);
    height: toRem(32);
    background: var(--background-secondary-main);
    color: var(--text-secondary-light);
    font-weight: 500;
    font-family: var(--app-font-family);
    transition: opacity 0.2s ease-in-out;

    &:not([disabled]):hover {
      opacity: 0.5;
    }
  }

  :deep(.pagination__page-button--active) {
    background: linear-gradient(
      90deg,
      var(--primary-main) -10.86%,
      var(--primary-dark) 108.88%
    );
    color: var(--text-primary-dark);
  }

  :deep(.pagination__navigation-button) {
    width: toRem(32);
    height: toRem(32);
    background: var(--background-secondary-main);
    color: var(--text-secondary-light);
    transform: rotate(90deg);
    transition: opacity 0.2s ease-in-out;

    &:not([disabled]):hover,
    &:not([disabled]):active,
    &:not([disabled]):focus {
      color: var(--text-secondary-light);
      background: var(--background-secondary-main);
    }

    &:not([disabled]):hover {
      opacity: 0.5;
    }
  }

  :deep(.pagination__navigation-button--next) {
    transform: rotate(-90deg);
  }
}
</style>
