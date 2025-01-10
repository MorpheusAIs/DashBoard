<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Withdraw MOR"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-5">
        <div class="flex flex-col items-end gap-3">
          <input-field
            v-model="form.withdrawAmount"
            :placeholder="$t('builder-withdraw-modal.stake-amount-plh')"
            :error-message="getFieldErrorMessage('withdrawAmount')"
            @blur="touchField('withdrawAmount')"
            :disabled="isSubmitting"
          >
            <template #nodeRight>
              <button
                type="button"
                class="stake-modal__inputs-max-btn"
                @click="setMaxAmount"
              >
                {{ $t('builder-withdraw-modal.stake-amount-max-btn') }}
              </button>
            </template>
          </input-field>

          <div class="flex items-center justify-between gap-2">
            <span class="stake-modal__details-label">
              {{ $t('builder-withdraw-modal.available-to-stake-balance') }}
            </span>
            <span class="stake-modal__details-value">3 667 456.748 MOR</span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>
      </div>

      <div class="mt-10 flex items-center justify-center gap-4">
        <app-button
          scheme="filled"
          color="secondary"
          @click="emit('update:is-shown', false)"
        >
          {{ $t('builder-withdraw-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit" :disabled="!isFieldsValid">
          {{ $t('builder-withdraw-modal.submit-btn') }}
        </app-button>
      </div>
    </form>
  </basic-modal>
</template>

<script setup lang="ts">
import { AppButton, BasicModal } from '@/common'
import { InputField } from '@/fields'
import { useFormValidation, useI18n } from '@/composables'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import { computed, reactive, ref, watch } from 'vue'
import {
  GetBuildersProjectQuery,
  GetUserAccountBuildersProject,
  GetUserAccountBuildersProjectQuery,
  GetUserAccountBuildersProjectQueryVariables,
} from '@/types/graphql'
import { numeric, required } from '@/validators'
import { formatEther, toEther } from '@/utils'
import {
  bus,
  BUS_EVENTS,
  createBuildersContract,
  ErrorHandler,
  getEthExplorerTxUrl,
  humanizeTime,
} from '@/helpers'
import { duration, time } from '@distributedlab/tools'
import { DEFAULT_TIME_FORMAT } from '@/const'
import { config } from '@config'
import { Provider } from '@/types'

const props = withDefaults(
  defineProps<{
    builderProject: GetBuildersProjectQuery['buildersProject']
    isShown?: boolean
  }>(),
  {
    isShown: true,
  },
)

const emit = defineEmits<{
  (e: 'update:is-shown', v: boolean): void
}>()

const { t } = useI18n()

const { networkId, provider } = storeToRefs(useWeb3ProvidersStore())

const buildersProjectUserAccount =
  ref<GetUserAccountBuildersProjectQuery['buildersUsers'][0]>()

const isSubmitting = ref(false)

const form = reactive({
  withdrawAmount: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    withdrawAmount: { required, numeric },
  })

const builderDetails = computed(() => [
  {
    label: t('builder-withdraw-modal.builder-lbl'),
    value: props.builderProject?.name,
  },
  {
    label: t('builder-withdraw-modal.current-stake-lbl'),
    value: `${formatEther(buildersProjectUserAccount.value?.staked || 0)} MOR`,
  },
  {
    label: t('builder-withdraw-modal.stake-after-withdrawal-lbl'),
    value:
      +buildersProjectUserAccount.value?.staked > +toEther(+form.withdrawAmount)
        ? `${formatEther(
            (buildersProjectUserAccount.value?.staked || 0) -
              +toEther(+form.withdrawAmount),
          )} MOR`
        : '0 MOR',
  },
])

const buildersContract = computed(() => {
  if (!provider.value.rawProvider) return

  return createBuildersContract(
    config.networksMap[networkId.value].contractAddressesMap.builders,
    provider.value.rawProvider as unknown as Provider,
  )
})

const loadUserAccountInProject = async () => {
  const { data: userAccountInProject } =
    await config.testnetBuildersApolloClient.query<
      GetUserAccountBuildersProjectQuery,
      GetUserAccountBuildersProjectQueryVariables
    >({
      query: GetUserAccountBuildersProject,
      fetchPolicy: 'network-only',
      variables: {
        address: provider.value.selectedAddress,
        buildersProjectId: props.builderProject?.id,
      },
    })

  buildersProjectUserAccount.value = userAccountInProject.buildersUsers?.[0]
}

const setMaxAmount = () => {}

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    const tx = await buildersContract.value?.contractInstance.withdraw(
      props.builderProject?.id,
      toEther(form.withdrawAmount),
    )

    if (!tx) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[networkId.value].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builder-withdraw-modal.stake-success-msg', { explorerTxUrl }),
    )
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}

watch(
  [() => provider.value.selectedAddress],
  () => {
    loadUserAccountInProject()
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
.stake-modal__details-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stake-modal__details-label {
  font-size: toRem(20);
  font-weight: 400;
  line-height: toRem(30);
}

.stake-modal__details-value {
  text-align: right;
  font-size: toRem(20);
  font-weight: 700;
  line-height: toRem(30);
}

.stake-modal__inputs-max-btn {
  color: var(--primary-main);
  font-size: toRem(18);
  font-weight: 700;
  line-height: toRem(24);

  @include square(48);
}
</style>
