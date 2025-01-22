<template>
  <input-field
    ref="dataFieldElement"
    :model-value="modelValueFormatted"
    :aria-expanded="isOpen"
    :disabled="disabled"
    :class="{ 'datetime-field--open': isOpen }"
    class="datetime-field"
    readonly
    @focus="isOpen = true"
    @keydown="onKeydown"
  >
    <template #nodeRight>
      <button
        class="datetime-field__btn"
        tabindex="-1"
        :disabled="disabled"
        @click="isOpen = true"
      >
        <app-icon class="datetime-field__btn-icon" :name="$icons.calendar" />
      </button>
    </template>
    <template #default>
      <template v-if="isSmallBreakpoint">
        <app-modal v-model:is-shown="isOpen">
          <div
            ref="flatpickrWrpElement"
            class="datetime-field__flatpickr-wrp"
          />
        </app-modal>
      </template>
      <template v-else>
        <transition name="drop" @after-enter="scrollToFlatpickr">
          <div
            v-show="isOpen"
            ref="flatpickrWrpElement"
            :class="[
              'datetime-field__flatpickr-wrp',
              `datetime-field__flatpickr-wrp--${props.position}`,
            ]"
          />
        </transition>
      </template>
    </template>
  </input-field>
</template>

<script lang="ts" setup>
import { AppIcon, AppModal } from '@/common'
import { useViewportSizes } from '@/composables'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { InputField } from '@/fields'
import { Time } from '@/utils'
import { onClickOutside } from '@vueuse/core'
import { default as createFlatpickr } from 'flatpickr'
import type { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance'
import type { Options } from 'flatpickr/dist/types/options'
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import arrowIconHTML from '@/assets/icons/chevron-down-icon.svg?raw'

type POSITION = 'bottom' | 'bottom-left' | 'bottom-right' | 'top' | 'center'

const emit = defineEmits<{
  (event: 'update:model-value', value: string): void
}>()

const props = withDefaults(
  defineProps<{
    /** Unix timestamp (seconds) */
    modelValue: string
    disabled?: boolean
    position?: POSITION
  }>(),
  {
    disabled: false,
    position: 'bottom-right',
  },
)

const { isSmallBreakpoint } = useViewportSizes()

const dataFieldElement = ref<HTMLDivElement | null>(null)
const flatpickrWrpElement = ref<HTMLDivElement | null>(null)
const flatpickrInstance = ref<FlatpickrInstance | null>(null)
const isOpen = ref(false)

const modelValueFormatted = computed<string>(() =>
  props.modelValue
    ? new Time(props.modelValue, 'X').format(DEFAULT_TIME_FORMAT)
    : '',
)

const initFlatpickr = (): void => {
  if (!flatpickrWrpElement.value) return

  const options: Options = {
    enableTime: true,
    enableSeconds: true,
    time_24hr: true,
    disableMobile: true,

    /** Date object with less than this min date works incorrectly */
    minDate: new Date('05/02/1924'),

    defaultHour: 0,
    monthSelectorType: 'static',
    minuteIncrement: 1,
    defaultDate: Number(props.modelValue) * 1000,
    clickOpens: false,
    appendTo: flatpickrWrpElement.value,
    prevArrow: arrowIconHTML,
    nextArrow: arrowIconHTML,
    onChange: dates => {
      if (!dates.length) return
      emit('update:model-value', String(dates[0].getTime() / 1000))
      isOpen.value = false
    },
  }

  flatpickrInstance.value = createFlatpickr(flatpickrWrpElement.value, options)

  nextTick(() => {
    flatpickrWrpElement.value?.querySelectorAll('input').forEach(element => {
      element.tabIndex = -1
    })
  })
}

const updateFlatpickrDate = (timestamp: string): void => {
  flatpickrInstance.value?.setDate(timestamp, false, 'U')
}

const scrollToFlatpickr = (): void => {
  flatpickrWrpElement.value?.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  })
}

const onKeydown = (event: KeyboardEvent) => {
  if ((event.target as HTMLInputElement)?.type === 'text') {
    switch (event.key) {
      case 'Backspace':
        emit('update:model-value', '')
        break
      case 'Tab':
        isOpen.value = false
        break
    }
  }
}

watch(() => props.modelValue, updateFlatpickrDate)

watch(flatpickrWrpElement, newElement => {
  if (!newElement) {
    flatpickrInstance.value?.destroy()
    return
  }

  initFlatpickr()
})

onClickOutside(
  dataFieldElement,
  () => {
    isOpen.value = false
  },
  { ignore: [flatpickrWrpElement] },
)

onBeforeUnmount(() => {
  flatpickrInstance.value?.destroy()
})
</script>

<style lang="scss" scoped>
$z-index: 1;

.datetime-field__btn {
  display: block;
  color: inherit;
  transition: color var(--transition-duration-fast)
    var(--transition-timing-default);

  &:not([disabled]) {
    &:hover {
      color: var(--primary-main);
    }

    .datetime-field--open &,
    &:focus,
    &:active {
      color: var(--primary-main);
    }
  }
}

.datetime-field__btn-icon {
  height: toRem(24);
  width: toRem(24);

  @include respond-to(medium) {
    height: toRem(20);
    width: toRem(20);
  }
}

.datetime-field__flatpickr-wrp {
  z-index: $z-index;
  position: absolute;
  top: 120%;
  right: 0;

  @include respond-to(small) {
    position: static;
  }

  &--center {
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
  }

  &--top {
    bottom: 120%;
    top: auto;
    right: 50%;
    transform: translateX(50%);
  }

  &--bottom {
    top: 120%;
    right: 50%;
    transform: translateX(50%);
  }

  &--bottom-left {
    top: 120%;
    left: 0;
    right: auto;
  }
}
</style>

<style lang="scss">
@import './flatpickr';
</style>
