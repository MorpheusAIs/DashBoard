<template>
  <form class="mor20-creation-form" @submit.prevent>
    <app-button
      scheme="link"
      :route="
        currentStep.id === STEP_IDS.general
          ? { name: $routes.appMor20EcosystemMain }
          : undefined
      "
      :text="$t('mor20-creation-form.prev-step-btn')"
      :icon-left="$icons.arrowLeft"
      @click="onBackBtnClick"
    />
    <div class="mor20-creation-form__content">
      <h2>{{ $t('mor20-creation-form.title') }}</h2>
      <step-tabs
        :current-step="currentStep"
        :steps="steps"
        class="mor20-creation-form__step-tabs"
      />
      <div class="mor20-creation-form__divider" />
      <transition name="fade" mode="out-in">
        <component
          :is="currentStepComponent"
          :is-submitting="isSubmitting"
          :is-submitted="currentStep.isSubmitted"
          class="mor20-creation-form__step"
        />
      </transition>
    </div>
    <div class="mor20-creation-form__buttons">
      <app-button
        class="mor20-creation-form__btn"
        color="secondary"
        :text="$t('mor20-creation-form.cancel-btn')"
        :route="{ name: $routes.appMor20EcosystemMain }"
      />
      <app-button
        class="mor20-creation-form__btn"
        type="submit"
        :disabled="!isFieldsValid || isSubmitting"
        @click="onSubmitBtnClick"
      >
        <transition name="fade" mode="out-in">
          <span class="mor20-creation-form__btn-text" :key="submitBtnText">
            {{ submitBtnText }}
          </span>
        </transition>
      </app-button>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation, useI18n } from '@/composables'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { parseUnits } from '@/utils'
import { computed, ref } from 'vue'
import { ArbitrumStep, EthereumStep, GeneralStep, StepTabs } from './components'
import { STEP_IDS } from './enums'
import { useStore } from './store'
import { type Step } from './types'

const emit = defineEmits<{
  (event: 'success'): void
}>()

const { t } = useI18n()

const { form, formStorageKey } = storeToRefs(useStore())
const web3ProvidersStore = useWeb3ProvidersStore()

const isSubmitting = ref(false)

const steps = computed<Step[]>(() => {
  const stepIds = Object.values(STEP_IDS)

  const formStepIdx = stepIds.findIndex(id => form.value.stepId === id)

  return stepIds.map((stepId, idx) => ({
    id: stepId,
    title: t(`mor20-creation-form.step-title.${stepId}`),
    isSubmitted: formStepIdx > idx,
  }))
})

const currentStepIdx = ref(
  steps.value.findIndex(stepTab => form.value.stepId === stepTab.id),
)

const currentStep = computed<Step>(() => steps.value[currentStepIdx.value])

const currentStepComponent = computed(
  () =>
    ({
      [STEP_IDS.general]: GeneralStep,
      [STEP_IDS.arbitrum]: ArbitrumStep,
      [STEP_IDS.ethereum]: EthereumStep,
    })[currentStep.value.id],
)

const submitBtnText = computed<string>(() =>
  !currentStep.value.isSubmitted
    ? t(`mor20-creation-form.submit-btn.${currentStep.value.id}`)
    : t('mor20-creation-form.submit-btn.next'),
)

const { isFieldsValid, isFormValid } = useFormValidation(form)

const onSubmitBtnClick = async () => {
  if (currentStep.value.isSubmitted) {
    currentStepIdx.value++
    return
  }

  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    let tx
    let explorerTxUrl

    switch (form.value.stepId) {
      case STEP_IDS.arbitrum: {
        const predictedAddresses =
          await web3ProvidersStore.l1FactoryContract.providerBased.value.predictAddresses(
            web3ProvidersStore.provider.selectedAddress,
            form.value.generalConfig.projectName,
          )

        await web3ProvidersStore.provider.selectChain(
          web3ProvidersStore.l2FactoryContractDetails.targetChainId,
        )

        tx =
          await web3ProvidersStore.l2FactoryContract.signerBased.value.deploy({
            isUpgradeable: form.value.arbitrumConfig.isUpgradeable,
            owner: form.value.arbitrumConfig.adminContractAddress,
            protocolName: form.value.generalConfig.projectName,
            mor20Name: form.value.arbitrumConfig.tokenName,
            mor20Symbol: form.value.arbitrumConfig.tokenSymbol,
            l1Sender: predictedAddresses.l1Sender_,
            firstSwapParams_: {
              tokenIn: form.value.arbitrumConfig.settings.tokenInAddress,
              tokenOut: form.value.arbitrumConfig.settings.tokenOutAddress,
              fee: form.value.arbitrumConfig.settings.firstSwapFee.value,
            },
            secondSwapFee:
              form.value.arbitrumConfig.settings.secondSwapFee.value,
          })

        explorerTxUrl = getEthExplorerTxUrl(
          web3ProvidersStore.l2FactoryContractDetails.explorerUrl,
          tx.hash,
        )

        break
      }

      case STEP_IDS.ethereum: {
        const predictedAddresses =
          await web3ProvidersStore.l2FactoryContract.providerBased.value.predictAddresses(
            web3ProvidersStore.provider.selectedAddress,
            form.value.generalConfig.projectName,
          )

        await web3ProvidersStore.provider.selectChain(
          web3ProvidersStore.l1FactoryContractDetails.targetChainId,
        )

        tx =
          await web3ProvidersStore.l1FactoryContract.signerBased.value.deploy({
            isUpgradeable: form.value.ethereumConfig.isUpgradeable,
            owner: form.value.ethereumConfig.adminContractAddress,
            protocolName: form.value.generalConfig.projectName,
            l2MessageReceiver: predictedAddresses.l2MessageReceiver_,
            l2TokenReceiver: predictedAddresses.l2TokenReceiver_,
            poolsInfo: form.value.ethereumConfig.groups.map(group => ({
              payoutStart: group.payoutStartAt,
              decreaseInterval: group.decreaseInterval,
              claimLockPeriod: Math.round(Number(group.claimLockPeriod) * 3600),
              initialReward: parseUnits(group.initialReward, 'ether'),
              rewardDecrease: parseUnits(group.rewardDecrease, 'ether'),
              isPublic: group.isPublic,
              withdrawLockPeriod: group.isPublic
                ? Math.round(Number(group.withdrawLockPeriod) * 3600)
                : 0,
              withdrawLockPeriodAfterStake: group.isPublic
                ? Math.round(Number(group.withdrawLockPeriodAfterStake) * 3600)
                : 0,
              minimalStake: group.isPublic
                ? parseUnits(group.minimalStake, 'ether')
                : 0,
            })),
          })

        explorerTxUrl = getEthExplorerTxUrl(
          web3ProvidersStore.l1FactoryContractDetails.explorerUrl,
          tx.hash,
        )
      }
    }

    if (tx && explorerTxUrl) {
      bus.emit(
        BUS_EVENTS.info,
        t('mor20-creation-form.tx-sent-message', { explorerTxUrl }),
      )

      await tx.wait()

      bus.emit(
        BUS_EVENTS.success,
        t('mor20-creation-form.success-message', { explorerTxUrl }),
      )
    }

    switch (form.value.stepId) {
      case STEP_IDS.general:
        form.value.stepId = STEP_IDS.arbitrum
        currentStepIdx.value++
        break
      case STEP_IDS.arbitrum:
        form.value.stepId = STEP_IDS.ethereum
        currentStepIdx.value++
        break
      case STEP_IDS.ethereum:
        localStorage.removeItem(formStorageKey.value)
        emit('success')
    }
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}

const onBackBtnClick = () => {
  if (currentStep.value.id === STEP_IDS.general) return
  currentStepIdx.value--
}
</script>

<style lang="scss" scoped>
.mor20-creation-form__content {
  margin-top: toRem(20);
  padding: toRem(40) toRem(38) toRem(28);
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #7c7c7d 0%, #cacaca 100%);
  background: linear-gradient(180deg, #222322 0%, #1d201c 100%);

  @include respond-to(medium) {
    padding: toRem(20) toRem(16) toRem(14);
  }
}

.mor20-creation-form__step-tabs {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.mor20-creation-form__divider {
  margin-top: toRem(24);
  height: toRem(1);
  background: linear-gradient(
    95.36deg,
    rgba(var(--white-rgb), 0.48) 0%,
    rgba(var(--white-rgb), 0.08) 100%
  );

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.mor20-creation-form__step {
  margin-top: toRem(24);

  @include respond-to(medium) {
    margin-top: toRem(16);
  }
}

.mor20-creation-form__buttons {
  margin-top: toRem(32);
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: toRem(16);

  @include respond-to(medium) {
    margin-top: toRem(24);
  }

  @include respond-to(xsmall) {
    flex-direction: column-reverse;
  }
}

.mor20-creation-form__btn {
  width: 100%;
  max-width: toRem(272);

  @include respond-to(medium) {
    max-width: unset;
  }
}

.mor20-creation-form__btn-text {
  font: inherit;
  color: inherit;
}
</style>
