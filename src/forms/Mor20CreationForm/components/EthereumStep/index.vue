<template>
  <div class="ethereum-step">
    <div class="ethereum-step__fields">
      <input-field
        v-model="form.ethereumConfig.adminContractAddress"
        :label="$t(`${I18N_KEY_PREFIX}.admin-contract-address-label`)"
        :placeholder="
          $t(`${I18N_KEY_PREFIX}.admin-contract-address-placeholder`)
        "
        :error-message="
          getFieldErrorMessage('ethereumConfig.adminContractAddress')
        "
        :disabled="isSubmitting || isSubmitted"
        @blur="touchField('ethereumConfig.adminContractAddress')"
      />
      <checkbox-field
        v-model="form.ethereumConfig.isUpgradeable"
        class="ethereum-step__is-upgradeable-checkbox"
        :label="$t(`${I18N_KEY_PREFIX}.is-upgradeable-label`)"
        :disabled="isSubmitting || isSubmitted"
      />
    </div>
    <div class="ethereum-step__divider" />
    <div ref="groupsElement" class="ethereum-step__groups">
      <h5 class="ethereum-step__group-title">
        {{
          $t(`${I18N_KEY_PREFIX}.group-title`, {
            idx: form.ethereumConfig.groups.length,
          })
        }}
      </h5>
      <p class="ethereum-step__group-instruction">
        {{ $t(`${I18N_KEY_PREFIX}.group-instruction`) }}
      </p>
      <div class="ethereum-step__groups-dashboard">
        <group-builder
          :preset="form.ethereumConfig.groups[editableGroupIdx]"
          :disabled="isSubmitting || isSubmitted"
          @build="onGroupBuild"
        />
        <div ref="groupsListWrpElement" class="ethereum-step__groups-list-wrp">
          <transition-group
            v-if="form.ethereumConfig.groups.length"
            tag="ul"
            name="fade"
            class="ethereum-step__groups-list"
          >
            <li v-for="(group, idx) in form.ethereumConfig.groups" :key="idx">
              <group-info-card
                :group="group"
                :token-symbol="form.arbitrumConfig.tokenSymbol"
                :disabled="
                  isSubmitting || isSubmitted || editableGroupIdx !== -1
                "
                @edit="editableGroupIdx = idx"
                @remove="form.ethereumConfig.groups.splice(idx, 1)"
              />
            </li>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useFormValidation } from '@/composables'
import { CheckboxField, InputField } from '@/fields'
import { storeToRefs } from '@/store'
import { address, required } from '@/validators'
import { nextTick, ref, watch } from 'vue'
import { GroupBuilder, GroupInfoCard } from './components'
import { useStore } from '../../store'
import { type EthereumConfigGroup } from '../../types'

const I18N_KEY_PREFIX = 'mor20-creation-form.ethereum-step'

defineProps<{
  isSubmitting: boolean
  isSubmitted: boolean
}>()

const groupsElement = ref<HTMLDivElement | null>(null)
const groupsListWrpElement = ref<HTMLDivElement | null>(null)
const editableGroupIdx = ref(-1)

const { form } = storeToRefs(useStore())

const { getFieldErrorMessage, touchField } = useFormValidation(form, {
  ethereumConfig: {
    adminContractAddress: { required, address },
    // groups validation is delegated to GroupBuilder.vue
  },
})

const onGroupBuild = (group: EthereumConfigGroup) => {
  if (editableGroupIdx.value !== -1) {
    form.value.ethereumConfig.groups.splice(editableGroupIdx.value, 1, group)
    editableGroupIdx.value = -1
    return
  }

  form.value.ethereumConfig.groups.push(group)
}

watch(
  () => form.value.ethereumConfig.groups.length,
  function scrollToBottom() {
    nextTick(() => {
      if (!groupsListWrpElement.value) return
      groupsListWrpElement.value.scrollTo({
        top: groupsListWrpElement.value.scrollHeight,
        behavior: 'smooth',
      })
    })
  },
)

watch(editableGroupIdx, newIdx => {
  if (!groupsElement.value || newIdx === -1) return
  window.scrollTo({
    top: groupsElement.value.offsetTop,
    behavior: 'smooth',
  })
})
</script>

<style lang="scss" scoped>
.ethereum-step__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);

  @include respond-to(medium) {
    grid-gap: toRem(16) toRem(20);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
  }
}

.ethereum-step__is-upgradeable-checkbox {
  grid-column: 1;
}

.ethereum-step__divider {
  margin-top: toRem(16);
  height: toRem(1);
  background: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.ethereum-step__groups {
  margin-top: toRem(16);
}

.ethereum-step__group-title {
  @include body-2-semi-bold;
}

.ethereum-step__group-instruction {
  margin-top: toRem(8);
}

.ethereum-step__groups-dashboard {
  margin-top: toRem(20);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);

  @include respond-to(medium) {
    grid-gap: toRem(16) toRem(20);
  }

  @include respond-to(tablet) {
    grid-template-columns: unset;
    grid-gap: toRem(24);
  }
}

.ethereum-step__groups-list-wrp {
  position: relative;
  overflow: auto;
  margin-top: toRem(42);

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }

  @include respond-to(tablet) {
    margin-top: unset;
  }
}

.ethereum-step__groups-list {
  position: absolute;
  width: 100%;
  display: grid;
  grid-auto-rows: max-content;
  gap: toRem(16);

  @include respond-to(tablet) {
    position: static;
  }
}
</style>
