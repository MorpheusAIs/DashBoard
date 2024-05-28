<template>
  <div class="ethereum-step">
    <div class="ethereum-step__fields">
      <input-field
        :model-value="form.ethereumConfig.tokenName"
        :label="$t(`${I18N_KEY_PREFIX}.token-name-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-name-placeholder`)"
        :error-message="
          formValidation.getFieldErrorMessage('ethereumConfig.tokenName')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.tokenName')"
        @update:model-value="emitRootField('tokenName', $event)"
      />
      <input-field
        :model-value="form.ethereumConfig.tokenSymbol"
        :label="$t(`${I18N_KEY_PREFIX}.token-symbol-label`)"
        :placeholder="$t(`${I18N_KEY_PREFIX}.token-symbol-placeholder`)"
        :error-message="
          formValidation.getFieldErrorMessage('ethereumConfig.tokenSymbol')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.tokenSymbol')"
        @update:model-value="emitRootField('tokenSymbol', $event)"
      />
      <input-field
        :model-value="form.ethereumConfig.adminContractAddress"
        :label="$t(`${I18N_KEY_PREFIX}.admin-contract-address-label`)"
        :placeholder="
          $t(`${I18N_KEY_PREFIX}.admin-contract-address-placeholder`)
        "
        :error-message="
          formValidation.getFieldErrorMessage(
            'ethereumConfig.adminContractAddress',
          )
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.adminContractAddress')"
        @update:model-value="emitRootField('adminContractAddress', $event)"
      />
      <checkbox-field
        :model-value="form.ethereumConfig.isUpgradeable"
        :label="$t('contract-creation-form.ethereum-step.is-upgradeable-label')"
        class="ethereum-step__is-upgradeable-checkbox"
        @update:model-value="emitRootField('isUpgradeable', $event)"
      />
    </div>
    <div class="ethereum-step__divider" />
    <div class="ethereum-step__groups">
      <h5 class="ethereum-step__group-title">
        {{ `GROUP #${form.ethereumConfig.groups.length}` }}
      </h5>
      <p class="ethereum-step__group-instruction">
        {{ $t(`${I18N_KEY_PREFIX}.group-instruction`) }}
      </p>
      <div class="ethereum-step__groups-dashboard">
        <group-builder :disabled="isSubmitting" @build="emitNewGroup($event)" />
        <div ref="groupsListWrpElement" class="ethereum-step__groups-list-wrp">
          <ul
            v-if="form.ethereumConfig.groups.length"
            class="ethereum-step__groups-list"
          >
            <li v-for="(group, idx) in form.ethereumConfig.groups" :key="idx">
              <group-info-card :group="group" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type FormValidation } from '@/composables'
import { CheckboxField, InputField } from '@/fields'
import { nextTick, ref, watch } from 'vue'
import { GroupBuilder, GroupInfoCard } from './components'
import type { EthereumConfigGroup, Form } from '../../types'

const I18N_KEY_PREFIX = 'contract-creation-form.ethereum-step'

const emit = defineEmits<{
  (event: 'update:form', value: Form): void
}>()

const props = defineProps<{
  form: Form
  formValidation: FormValidation
  isSubmitting: boolean
}>()

const groupsListWrpElement = ref<HTMLDivElement | null>(null)

watch(
  () => props.form.ethereumConfig.groups.length,
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

const emitRootField = (
  field: keyof Form['ethereumConfig'],
  value: string | number,
) => {
  emit('update:form', {
    ...props.form,
    ethereumConfig: { ...props.form.ethereumConfig, [field]: value },
  })
}

const emitNewGroup = (group: EthereumConfigGroup) => {
  emit('update:form', {
    ...props.form,
    ethereumConfig: {
      ...props.form.ethereumConfig,
      groups: [...props.form.ethereumConfig.groups, group],
    },
  })
}
</script>

<style lang="scss" scoped>
.ethereum-step__fields {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
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
  margin-top: toRem(40);
}

.ethereum-step__group-title {
  @include body-2-semi-bold;
}

.ethereum-step__group-instruction {
  margin-top: toRem(20);
}

.ethereum-step__groups-dashboard {
  margin-top: toRem(20);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: toRem(16) toRem(32);
}

.ethereum-step__groups-list-wrp {
  position: relative;
  overflow: auto;
  margin-top: toRem(58);

  &::-webkit-scrollbar {
    height: 0;
    width: 0;
  }
}

.ethereum-step__groups-list {
  position: absolute;
  width: 100%;
  display: grid;
  grid-auto-rows: max-content;
  gap: toRem(32);
}
</style>
