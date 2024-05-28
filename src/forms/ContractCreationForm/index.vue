<template>
  <form class="contract-creation-form" @submit.prevent>
    <div class="contract-creation-form__content">
      <h2>{{ $t('contract-creation-form.title') }}</h2>
      <step-tabs-20
        v-model:current-step-tab="currentStepTab"
        :step-tabs="stepTabs"
        class="contract-creation-form__step-tabs"
      />
      <div class="contract-creation-form__divider" />
      <transition name="fade" mode="out-in">
        <component
          v-model:form="form"
          :form-validation="formValidation"
          :is-submitting="isSubmitting"
          :is="stepComponent"
          class="contract-creation-form__step"
        />
      </transition>
    </div>
    <div class="contract-creation-form__controllers">
      <app-button
        class="contract-creation-form__btn"
        color="secondary"
        :text="$t('contract-creation-form.cancel-btn')"
        :route="{ name: $routes.appMor20EcosystemMain }"
      />
      <app-button
        class="contract-creation-form__btn"
        type="submit"
        :text="$t(`contract-creation-form.submit-btn.${form.stepId}`)"
        :disabled="!formValidation.isFieldsValid || isSubmitting"
        @click="submitStep"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation, useI18n } from '@/composables'
import { useWeb3ProvidersStore } from '@/store'
import { required } from '@/validators'
import { useStorage } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import {
  ArbitrumStep,
  EthereumStep,
  GeneralStep,
  StepTabs20,
} from './components'
import { STEP_IDS } from './enums'
import type { Form, StepTab } from './types'

const { t } = useI18n()

const web3ProvidersStore = useWeb3ProvidersStore()

const stepTabs = computed<StepTab[]>(() =>
  Object.values(STEP_IDS).map(stepId => ({
    id: stepId,
    title: t(`contract-creation-form.step-title.${stepId}`),
  })),
)

const currentStepTab = computed<StepTab>(
  () =>
    stepTabs.value.find(stepTab => stepTab.id === form.value.stepId) as StepTab,
)

const isSubmitting = ref(false)

const form = reactive(
  useStorage<Form>(
    `${web3ProvidersStore.provider.selectedAddress}.${web3ProvidersStore.networkId}.contract-creation-form`,
    {
      stepId: STEP_IDS.general,
      generalConfig: {
        projectName: '',
      },
      arbitrumConfig: {
        tokenName: '',
        tokenSymbol: '',
        adminContractAddress: '',
        settings: {
          tokenInAddress: '',
          tokenOutAddress: '',
          firstSwapFee: '',
          secondSwapFee: '',
        },
      },
      ethereumConfig: {
        tokenName: '',
        tokenSymbol: '',
        adminContractAddress: '',
        isUpgradeable: true,
        groups: [],
      },
    },
  ),
)

const formValidation = reactive(
  useFormValidation(
    form,
    computed(() => ({
      ...(form.value.stepId === STEP_IDS.general && {
        generalConfig: { projectName: { required } },
      }),
      ...(form.value.stepId === STEP_IDS.arbitrum && {
        arbitrumConfig: {
          tokenName: { required },
          tokenSymbol: { required },
          adminContractAddress: { required },
          settings: {
            tokenInAddress: { required },
            tokenOutAddress: { required },
            firstSwapFee: { required },
            secondSwapFee: { required },
          },
        },
      }),
      ...(form.value.stepId === STEP_IDS.ethereum && {
        ethereumConfig: {
          tokenName: { required },
          tokenSymbol: { required },
          adminContractAddress: { required },
          // groups validation is delegated to GroupBuilder.vue
        },
      }),
    })),
  ),
)

const submitStep = () => {
  if (!formValidation.isFormValid()) return

  isSubmitting.value = true

  switch (form.value.stepId) {
    case STEP_IDS.general:
      form.value.stepId = STEP_IDS.arbitrum
      break
    case STEP_IDS.arbitrum:
      form.value.stepId = STEP_IDS.ethereum
  }

  isSubmitting.value = false
}

const stepComponent = computed(
  () =>
    ({
      [STEP_IDS.general]: GeneralStep,
      [STEP_IDS.arbitrum]: ArbitrumStep,
      [STEP_IDS.ethereum]: EthereumStep,
    }[form.value.stepId] || null),
)
</script>

<style lang="scss" scoped>
.contract-creation-form__content {
  padding: toRem(40) toRem(38) toRem(28);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #7c7c7d 0%, #cacaca 100%);
  background: linear-gradient(180deg, #222322 0%, #1d201c 100%);
}

.contract-creation-form__step-tabs {
  margin-top: toRem(24);
}

.contract-creation-form__divider {
  margin-top: toRem(24);
  height: toRem(1);
  background: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );
}

.contract-creation-form__step {
  margin-top: toRem(24);
}

.contract-creation-form__controllers {
  margin-top: toRem(32);
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: toRem(16);
}

.contract-creation-form__btn {
  width: 100%;
  max-width: toRem(272);
}
</style>
