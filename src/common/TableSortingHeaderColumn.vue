<template>
  <div class="table-sorting-header-column">
    <span class="table-sorting-header-column__text">
      {{ text }}
    </span>
    <div class="table-sorting-header-column__buttons">
      <app-button
        class="table-sorting-header-column__button"
        size="none"
        scheme="link"
        @click="emit('sort', SORTING_ORDER.asc)"
      >
        <app-icon
          class="table-sorting-header-column__button-icon"
          :class="{
            'table-sorting-header-column__button-icon--active':
              sorting === SORTING_ORDER.asc,
          }"
          :name="$icons.triangleTop"
        />
      </app-button>
      <app-button
        class="table-sorting-header-column__button"
        size="none"
        scheme="link"
        @click="emit('sort', SORTING_ORDER.desc)"
      >
        <app-icon
          class="table-sorting-header-column__button-icon"
          :class="{
            'table-sorting-header-column__button-icon--active':
              sorting === SORTING_ORDER.desc,
          }"
          :name="$icons.triangleTop"
        />
      </app-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SORTING_ORDER } from '@/enums'
import { AppButton, AppIcon } from '@/common/index'

const emit = defineEmits<{
  (e: 'sort', value: SORTING_ORDER): void
}>()

defineProps<{
  text: string
  sorting: SORTING_ORDER
}>()
</script>

<style scoped lang="scss">
.table-sorting-header-column {
  display: flex;
  gap: toRem(12);
  align-items: center;
}

.table-sorting-header-column__text {
  font-size: toRem(16);
  color: var(--text-tertiary-main);

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.table-sorting-header-column__buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.table-sorting-header-column__button {
  &:nth-child(2) {
    transform: rotate(180deg);
  }
}

.table-sorting-header-column__button-icon {
  width: toRem(10);
  height: toRem(5);
  color: var(--background-tertiary-light);

  &--active {
    color: var(--primary-main);
  }
}
</style>
