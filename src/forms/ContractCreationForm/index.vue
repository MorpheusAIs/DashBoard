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
        :disabled="!formValidation.isFieldsValid.value || isSubmitting"
        @click="submitStep"
      />
    </div>
  </form>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { useFormValidation, useI18n } from '@/composables'
import { bus, BUS_EVENTS, ErrorHandler, getEthExplorerTxUrl } from '@/helpers'
import { useWeb3ProvidersStore } from '@/store'
import { parseUnits } from '@/utils'
import { address, ether, maxEther, required } from '@/validators'
import { config } from '@config'
import { useStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import {
  ArbitrumStep,
  EthereumStep,
  GeneralStep,
  StepTabs20,
} from './components'
import { STEP_IDS } from './enums'
import type { Form, StepTab } from './types'

const emit = defineEmits<{
  (event: 'success'): void
}>()

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

const storageKey = computed<string>(
  () =>
    `${web3ProvidersStore.provider.selectedAddress}.${web3ProvidersStore.networkId}.contract-creation-form`,
)

const isSubmitting = ref(false)

const form = useStorage<Form>(storageKey.value, {
  stepId: STEP_IDS.general,
  generalConfig: {
    projectName: '',
  },
  arbitrumConfig: {
    tokenName: '',
    tokenSymbol: '',
    adminContractAddress: '',
    isUpgradeable: true,
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
})

const formValidation = useFormValidation(
  form,
  computed(() => ({
    ...(form.value.stepId === STEP_IDS.general && {
      generalConfig: { projectName: { required } },
    }),
    ...(form.value.stepId === STEP_IDS.arbitrum && {
      arbitrumConfig: {
        tokenName: { required },
        tokenSymbol: { required },
        adminContractAddress: { required, address },
        settings: {
          tokenInAddress: { required, address },
          tokenOutAddress: { required, address },
          firstSwapFee: {
            required,
            ether,
            maxEther: maxEther('0.000000000016777215'),
          },
          secondSwapFee: {
            required,
            ether,
            maxEther: maxEther('0.000000000016777215'),
          },
        },
      },
    }),
    ...(form.value.stepId === STEP_IDS.ethereum && {
      ethereumConfig: {
        tokenName: { required },
        tokenSymbol: { required },
        adminContractAddress: { required, address },
        // groups validation is delegated to GroupBuilder.vue
      },
    }),
  })),
)

const submitStep = async () => {
  if (!formValidation.isFormValid()) return

  isSubmitting.value = true

  try {
    const { l1FactoryContract, l2FactoryContract } = web3ProvidersStore
    let tx
    let explorerTxUrl

    switch (form.value.stepId) {
      case STEP_IDS.arbitrum: {
        const predictedAddresses =
          await l1FactoryContract.providerBased.value.predictAddresses(
            web3ProvidersStore.provider.selectedAddress,
            form.value.generalConfig.projectName,
          )

        await web3ProvidersStore.provider.selectChain(
          config.networks[web3ProvidersStore.networkId].extendedChainId,
        )

        tx = await l2FactoryContract.signerBased.value.deploy({
          isUpgradeable: form.value.arbitrumConfig.isUpgradeable,
          owner: form.value.arbitrumConfig.adminContractAddress,
          protocolName: form.value.generalConfig.projectName,
          mor20Name: form.value.arbitrumConfig.tokenName,
          mor20Symbol: form.value.arbitrumConfig.tokenSymbol,
          l1Sender: predictedAddresses.l1Sender_,
          firstSwapParams_: {
            tokenIn: form.value.arbitrumConfig.settings.tokenInAddress,
            tokenOut: form.value.arbitrumConfig.settings.tokenOutAddress,
            fee: parseUnits(
              form.value.arbitrumConfig.settings.firstSwapFee,
              'ether',
            ),
          },
          secondSwapFee: parseUnits(
            form.value.arbitrumConfig.settings.secondSwapFee,
            'ether',
          ),
        })

        explorerTxUrl = getEthExplorerTxUrl(
          config.networks[web3ProvidersStore.networkId].extendedExplorerUrl,
          tx.hash,
        )

        break
      }

      case STEP_IDS.ethereum: {
        const predictedAddresses =
          await l2FactoryContract.providerBased.value.predictAddresses(
            web3ProvidersStore.provider.selectedAddress,
            form.value.generalConfig.projectName,
          )

        await web3ProvidersStore.provider.selectChain(
          config.networks[web3ProvidersStore.networkId].chainId,
        )

        tx = await l1FactoryContract.signerBased.value.deploy({
          isUpgradeable: form.value.ethereumConfig.isUpgradeable,
          owner: form.value.ethereumConfig.adminContractAddress,
          protocolName: form.value.generalConfig.projectName,
          l2MessageReceiver: predictedAddresses.l2MessageReceiver_,
          l2TokenReceiver: predictedAddresses.l2TokenReceiver_,
          poolsInfo: form.value.ethereumConfig.groups.map(group => ({
            payoutStart: group.payoutStartAt,
            decreaseInterval: group.decreaseInterval,
            claimLockPeriod: Math.round(Number(group.claimLockPeriod) / 3600),
            initialReward: parseUnits(group.initialReward, 'ether'),
            rewardDecrease: parseUnits(group.rewardDecrease, 'ether'),
            isPublic: group.isPublic,
            withdrawLockPeriod: group.isPublic
              ? Math.round(Number(group.withdrawLockPeriod) * 60)
              : 0,
            withdrawLockPeriodAfterStake: group.isPublic
              ? Math.round(Number(group.withdrawLockPeriodAfterStake) * 60)
              : 0,
            minimalStake: group.isPublic ? group.minimalStake : 0,
          })),
        })

        explorerTxUrl = getEthExplorerTxUrl(
          config.networks[web3ProvidersStore.networkId].explorerUrl,
          tx.hash,
        )
      }
    }

    if (tx && explorerTxUrl) {
      bus.emit(
        BUS_EVENTS.info,
        t('contract-creation-form.tx-sent-message', { explorerTxUrl }),
      )

      await tx.wait()

      bus.emit(
        BUS_EVENTS.success,
        t('contract-creation-form.success-message', { explorerTxUrl }),
      )
    }

    switch (form.value.stepId) {
      case STEP_IDS.general:
        form.value.stepId = STEP_IDS.arbitrum
        break
      case STEP_IDS.arbitrum:
        form.value.stepId = STEP_IDS.ethereum
        break
      case STEP_IDS.ethereum:
        localStorage.removeItem(storageKey.value)
        emit('success')
    }
  } catch (error) {
    ErrorHandler.process(error)
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
