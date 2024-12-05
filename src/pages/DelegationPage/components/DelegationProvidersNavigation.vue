<template>
  <!--TODO: MOVE TO ONE COMPONENT WITH RefereesListNavigation.vue-->
  <div class="delegation-providers-navigation">
    <div class="delegation-providers-navigation__cel">
      <span class="delegation-providers-navigation__cel-text">
        {{ $t('delegation-providers-navigation.address-text') }}
      </span>
    </div>
    <div class="delegation-providers-navigation__cel">
      <span class="delegation-providers-navigation__cel-text">
        {{
          $t('delegation-providers-navigation.staked-text', {
            asset: web3ProvidersStore.rewardsTokenSymbol,
          })
        }}
      </span>
      <div class="delegation-providers-navigation__buttons">
        <app-button
          class="delegation-providers-navigation__button"
          size="none"
          scheme="link"
          @click="emit('sort', SORTING_ORDER.asc)"
        >
          <app-icon
            class="delegation-providers-navigation__button-icon"
            :class="{
              'delegation-providers-navigation__button-icon--active':
                sorting === SORTING_ORDER.asc,
            }"
            :name="$icons.triangleTop"
          />
        </app-button>
        <app-button
          class="delegation-providers-navigation__button"
          size="none"
          scheme="link"
          @click="emit('sort', SORTING_ORDER.desc)"
        >
          <app-icon
            class="delegation-providers-navigation__button-icon"
            :class="{
              'delegation-providers-navigation__button-icon--active':
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
import { useWeb3ProvidersStore } from '@/store'

defineProps<{
  sorting: SORTING_ORDER
}>()

const web3ProvidersStore = useWeb3ProvidersStore()

const emit = defineEmits<{
  (e: 'sort', SORTING_ORDER): void
}>()
</script>

<style scoped lang="scss">
.delegation-providers-navigation {
  display: grid;
  grid-template-columns: repeat(2, minmax(toRem(100), 1fr));
  gap: toRem(32);
  padding: toRem(8) toRem(32);
}

.delegation-providers-navigation__cel {
  display: flex;
  gap: toRem(12);
  align-items: center;
}

.delegation-providers-navigation__cel-text {
  font-size: toRem(16);
  color: var(--text-tertiary-main);

  @include respond-to(small) {
    font-size: toRem(14);
  }
}

.delegation-providers-navigation__buttons {
  display: flex;
  flex-direction: column;
  gap: toRem(4);
}

.delegation-providers-navigation__button {
  &:nth-child(2) {
    transform: rotate(180deg);
  }
}

.delegation-providers-navigation__button-icon {
  width: toRem(10);
  height: toRem(5);
  color: var(--background-tertiary-light);

  &--active {
    color: var(--primary-main);
  }
}
</style>
