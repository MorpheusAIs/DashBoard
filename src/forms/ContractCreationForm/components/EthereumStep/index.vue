<template>
  <div class="ethereum-step">
    <div class="ethereum-step__fields">
      <input-field
        :model-value="form.ethereumConfig.tokenName"
        :label="$t('contract-creation-form.ethereum-step.token-name-label')"
        :placeholder="
          $t('contract-creation-form.ethereum-step.token-name-placeholder')
        "
        :error-message="
          formValidation.getFieldErrorMessage('ethereumConfig.tokenName')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.tokenName')"
        @update:model-value="
          emit('update:form', set(form, 'ethereumConfig.tokenName', $event))
        "
      />
      <input-field
        :model-value="form.ethereumConfig.tokenSymbol"
        :label="$t('contract-creation-form.ethereum-step.token-symbol-label')"
        :placeholder="
          $t('contract-creation-form.ethereum-step.token-symbol-placeholder')
        "
        :error-message="
          formValidation.getFieldErrorMessage('ethereumConfig.tokenSymbol')
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.tokenSymbol')"
        @update:model-value="
          emit('update:form', set(form, 'ethereumConfig.tokenSymbol', $event))
        "
      />
      <input-field
        :model-value="form.ethereumConfig.adminContractAddress"
        :label="
          $t(
            'contract-creation-form.ethereum-step.admin-contract-address-label',
          )
        "
        :placeholder="
          $t(
            // eslint-disable-next-line max-len
            'contract-creation-form.ethereum-step.admin-contract-address-placeholder',
          )
        "
        :error-message="
          formValidation.getFieldErrorMessage(
            'ethereumConfig.adminContractAddress',
          )
        "
        :disabled="isSubmitting"
        @blur="formValidation.touchField('ethereumConfig.adminContractAddress')"
        @update:model-value="
          emit(
            'update:form',
            set(form, 'ethereumConfig.adminContractAddress', $event),
          )
        "
      />
      <checkbox-field
        :model-value="form.ethereumConfig.isUpgradeable"
        :label="$t('contract-creation-form.ethereum-step.is-upgradeable-label')"
        class="ethereum-step__is-upgradeable-checkbox"
        @update:model-value="
          emit('update:form', set(form, 'ethereumConfig.isUpgradeable', $event))
        "
      />
    </div>
    <div class="ethereum-step__divider" />
    <div class="ethereum-step__groups">
      <h5 class="ethereum-step__group-title">
        {{ `GROUP #${form.ethereumConfig.groups.length}` }}
      </h5>
      <p class="ethereum-step__group-instruction">
        {{ $t('contract-creation-form.ethereum-step.group-instruction') }}
      </p>
      <div class="ethereum-step__groups-dashboard">
        <group-builder
          :disabled="isSubmitting"
          @build="
            emit(
              'update:form',
              set(form, 'ethereumConfig.groups', [
                ...form.ethereumConfig.groups,
                $event,
              ]),
            )
          "
        />
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
import { set } from 'lodash'
import { nextTick, ref, watch } from 'vue'
import { GroupBuilder, GroupInfoCard } from './components'
import { Form } from '../../types'

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
