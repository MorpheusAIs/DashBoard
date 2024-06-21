<template>
  <div class="group-info-card">
    <div class="group-info-card__status-wrp">
      <h5
        class="group-info-card__status"
        :class="[`group-info-card__status--${status}`]"
      >
        {{ $t(`${I18N_KEY_PREFIX}.status.${status}`) }}
      </h5>
      <div class="group-info-card__controllers">
        <button
          v-for="controller in CONTROLLERS"
          :key="controller.id"
          :disabled="disabled"
          :class="`group-info-card__controller--${controller.id}`"
          class="group-info-card__controller"
          @click="controller.onClick"
        >
          <app-icon
            class="group-info-card__controller-icon"
            :name="controller.iconName"
          />
        </button>
      </div>
    </div>
    <ul class="group-info-card__indicators">
      <li
        v-for="(indicator, idx) in indicators"
        :key="idx"
        class="group-info-card__indicator"
      >
        <h5 class="group-info-card__indicator-title">
          {{ indicator.title }}
        </h5>
        <p class="group-info-card__indicator-value">
          {{ indicator.value }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { AppIcon } from '@/common'
import { useI18n } from '@/composables'
import { ICON_NAMES } from '@/enums'
import { Time } from '@/utils'
import { computed } from 'vue'
import { type EthereumConfigGroup } from '../../../types'

type Indicator = {
  title: string
  value: string
}

type Controller = {
  id: string
  iconName: ICON_NAMES
  onClick: () => void
}

const I18N_KEY_PREFIX = 'contract-creation-form.ethereum-step.group-info-card'
const TIME_FORMAT = 'MMM DD, YYYY h:mmA'
const CONTROLLERS: Controller[] = [
  {
    id: 'edit',
    iconName: ICON_NAMES.edit,
    onClick: () => {
      emit('edit')
    },
  },
  {
    id: 'remove',
    iconName: ICON_NAMES.trash,
    onClick: () => {
      emit('remove')
    },
  },
]

const props = withDefaults(
  defineProps<{
    group: EthereumConfigGroup
    tokenSymbol: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'edit'): void
  (event: 'remove'): void
}>()

const { t } = useI18n()

const status = computed<string>(() =>
  props.group.isPublic ? 'public' : 'private',
)

const indicators = computed<Indicator[]>(() =>
  props.group.isPublic
    ? [
        {
          title: t(`${I18N_KEY_PREFIX}.payout-start-title`),
          value: new Time(props.group.payoutStartAt, 'X').format(TIME_FORMAT),
        },
        {
          title: t(`${I18N_KEY_PREFIX}.decrease-interval-title`),
          value: `${Math.floor(Number(props.group.decreaseInterval) / 3600)} h`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.withdraw-lock-period-title`),
          value: `${props.group.withdrawLockPeriod}h (${new Time(
            Number(props.group.payoutStartAt) +
              Number(props.group.withdrawLockPeriod) * 3600,
          ).format(TIME_FORMAT)})`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.claim-lock-period-title`),
          value: `${props.group.claimLockPeriod} h`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.withdraw-lock-period-after-stake-title`),
          value: `${props.group.withdrawLockPeriodAfterStake} h`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.initial-reward-title`),
          value: `${props.group.initialReward} ${props.tokenSymbol}`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.reward-decrease-title`),
          value: `${props.group.rewardDecrease} ${props.tokenSymbol}`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.minimal-stake-title`),
          value: `${props.group.minimalStake} ${props.tokenSymbol}`,
        },
      ]
    : [
        {
          title: t(`${I18N_KEY_PREFIX}.payout-start-title`),
          value: new Time(props.group.payoutStartAt, 'X').format(TIME_FORMAT),
        },
        {
          title: t(`${I18N_KEY_PREFIX}.decrease-interval-title`),
          value: `${Math.floor(Number(props.group.decreaseInterval) / 3600)} h`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.initial-reward-title`),
          value: `${props.group.initialReward} ${props.tokenSymbol}`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.claim-lock-period-title`),
          value: `${props.group.claimLockPeriod} h`,
        },
        {
          title: t(`${I18N_KEY_PREFIX}.reward-decrease-title`),
          value: `${props.group.rewardDecrease} ${props.tokenSymbol}`,
        },
      ],
)
</script>

<style lang="scss" scoped>
.group-info-card {
  padding: toRem(16);
  background: var(--background-secondary-main);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.group-info-card__status-wrp {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group-info-card__status {
  background: #515c57;
  padding: toRem(2) toRem(18);

  &--public {
    color: var(--primary-main);
  }

  &--private {
    $color: #ffa011;

    color: $color;
  }

  @include body-3-regular;
}

.group-info-card__controllers {
  display: flex;
  align-items: center;
  gap: toRem(24);

  @include respond-to(medium) {
    gap: toRem(12);
  }
}

.group-info-card__controller {
  transition: color var(--transition-duration-fast)
    var(--transition-timing-default);

  &--edit {
    color: var(--primary-main);
  }

  &--remove {
    $color: #ff2f2f;

    color: $color;
  }

  &[disabled] {
    color: var(--disable-primary-main);
  }

  &:not([disabled]):hover {
    color: var(--text-secondary-main);
  }
}

.group-info-card__controller-icon {
  height: toRem(30);
  width: toRem(30);

  @include respond-to(medium) {
    height: toRem(24);
    width: toRem(24s);
  }
}

.group-info-card__indicators {
  margin: toRem(20) toRem(36) 0 0;
  display: grid;
  grid-template-columns: repeat(2, auto);
  grid-gap: toRem(20) toRem(32);
  justify-content: space-between;
}

.group-info-card__indicator {
  display: grid;
}

.group-info-card__indicator-title {
  color: var(--text-secondary-main);

  @include text-ellipsis;
}

.group-info-card__indicator-value {
  @include body-2-semi-bold;

  @include text-ellipsis;
}
</style>
