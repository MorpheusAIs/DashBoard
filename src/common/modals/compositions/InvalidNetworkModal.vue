<template>
  <basic-modal
    v-bind="props"
    class="invalid-network-modal"
    :title="$t('invalid-network-modal.title')"
    :subtitle="$t('invalid-network-modal.subtitle')"
    @update:is-shown="emit('update:is-shown', $event)"
  >
    <div class="invalid-network-modal__board">
      <div
        v-for="network in config.IS_TESTNET ? testNetworks : mainNetworks"
        :key="network.title"
        class="invalid-network-modal__network-wrp"
      >
        <icon
          class="invalid-network-modal__network-icon"
          :name="network.iconName"
        />
        <span class="invalid-network-modal__network-title">
          {{ network.title }}
        </span>
        <!-- eslint-disable-next-line vue-i18n/no-raw-text -->
        <span class="invalid-network-modal__board-plus">{{ '+' }}</span>
      </div>
    </div>
    <app-button
      class="invalid-network-modal__btn"
      :text="$t('invalid-network-modal.switch-btn')"
    />
  </basic-modal>
</template>

<script lang="ts" setup>
import { useContext } from '@/composables'
import { ICON_NAMES } from '@/enums'
import { config } from '@config'
import AppButton from '../../AppButton.vue'
import BasicModal from '../BasicModal.vue'
import Icon from '../../Icon.vue'

type Network = {
  iconName: ICON_NAMES
  title: string
}

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const props = withDefaults(
  defineProps<{
    isShown: boolean
    isCloseByClickOutside?: boolean
  }>(),
  {
    isCloseByClickOutside: false,
  },
)

const { $t } = useContext()

const mainNetworks: Network[] = [
  {
    iconName: ICON_NAMES.ethereumAlt1,
    title: $t('invalid-network-modal.network-title.ethereum'),
  },
  {
    iconName: ICON_NAMES.arbitrumAlt1,
    title: $t('invalid-network-modal.network-title.arbitrum'),
  },
]

const testNetworks: Network[] = [
  {
    iconName: ICON_NAMES.goerliAlt1,
    title: $t('invalid-network-modal.network-title.goerli'),
  },
  {
    iconName: ICON_NAMES.arbitrumAlt1,
    title: $t('invalid-network-modal.network-title.arbitrum-testnet'),
  },
]
</script>

<style lang="scss" scoped>
.invalid-network-modal__board {
  margin-top: toRem(40);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: toRem(10);
  border: toRem(1) solid var(--border-primary-main);
  background: var(--background-secondary-main);
  padding: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(28);
    padding: toRem(14);
  }
}

.invalid-network-modal__network-wrp {
  display: flex;
  align-items: center;
  gap: toRem(8);

  @include body-3-medium;
}

.invalid-network-modal__network-title {
  font: inherit;
}

.invalid-network-modal__network-icon {
  height: toRem(28);
  width: toRem(28);

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(24);
  }
}

.invalid-network-modal__board-plus {
  color: var(--primary-main);

  .invalid-network-modal__network-wrp:last-child & {
    display: none;
  }
}

.invalid-network-modal .invalid-network-modal__btn {
  margin: toRem(40) auto 0;
  min-width: toRem(200);

  @include respond-to(medium) {
    margin: toRem(36) auto 0;
    min-width: toRem(162);
  }
}
</style>
