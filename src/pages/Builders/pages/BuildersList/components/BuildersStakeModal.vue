<template>
  <basic-modal
    :is-shown="isShown"
    @update:is-shown="emit('update:is-shown', $event)"
    title="Stake MOR"
  >
    <form @submit.prevent="submit" class="max-h-[80dvh] overflow-auto">
      <div class="mt-8 flex flex-col gap-5">
        <div class="flex flex-col items-end gap-3">
          <input-field
            v-model="form.stakeAmount"
            :placeholder="$t('builders-stake-modal.stake-amount-plh')"
            :error-message="getFieldErrorMessage('stakeAmount')"
            @blur="touchField('stakeAmount')"
            :disabled="isSubmitting"
          >
            <template #nodeRight>
              <button
                type="button"
                class="stake-modal__inputs-max-btn"
                @click="setMaxAmount"
              >
                {{ $t('builders-stake-modal.stake-amount-max-btn') }}
              </button>
            </template>
          </input-field>

          <div class="flex items-center justify-between gap-2">
            <span class="stake-modal__details-label">
              {{ $t('builders-stake-modal.available-to-stake-balance') }}
            </span>
            <span class="stake-modal__details-value">3 667 456.748 MOR</span>
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-col gap-3 bg-backdropModal px-6 py-4">
        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(0, 3)"
          :key="i"
        >
          <span class="text-textSecondaryMain typography-body3">
            {{ el.label }}
          </span>
          <span class="font-bold text-textSecondaryMain typography-body3">
            {{ el.value }}
          </span>
        </div>

        <div class="my-2 h-[1px] w-full bg-backgroundPrimaryMain opacity-20" />

        <div
          class="flex items-center justify-between"
          v-for="(el, i) in builderDetails.slice(3)"
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
          {{ $t('builders-stake-modal.cancel-btn') }}
        </app-button>
        <app-button type="submit" :disabled="!isFieldsValid">
          {{ $t('builders-stake-modal.submit-btn') }}
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
import { numeric, required } from '@/validators'
import {
  bus,
  BUS_EVENTS,
  createBuildersContract,
  ErrorHandler,
  getEthExplorerTxUrl,
  humanizeTime,
} from '@/helpers'
import { config } from '@config'
import { Provider } from '@/types'
import { formatEther, toEther } from '@/utils'
import {
  GetBuildersProjectQuery,
  GetUserAccountBuildersProject,
  GetUserAccountBuildersProjectQuery,
  GetUserAccountBuildersProjectQueryVariables,
} from '@/types/graphql'
import { duration, time } from '@distributedlab/tools'
import { DEFAULT_TIME_FORMAT } from '@/const'

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
  stakeAmount: '',
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(form, {
    stakeAmount: { required, numeric },
  })

const builderDetails = computed(() => [
  {
    label: t('builders-stake-modal.builder-lbl'),
    value: props.builderProject?.name,
  },
  {
    label: t('builders-stake-modal.min-deposit-lbl'),
    value: `${formatEther(props.builderProject?.minimalDeposit)} MOR`,
  },
  {
    label: t('builders-stake-modal.lock-period-lbl'),
    value: humanizeTime(
      props.builderProject?.withdrawLockPeriodAfterDeposit / 1000,
    ),
  },
  {
    label: t('builders-stake-modal.new-stake-amount-lbl'),
    value: `${+formatEther(buildersProjectUserAccount.value?.staked || 0) + +form.stakeAmount} MOR`,
  },
  {
    label: t('builders-stake-modal.new-unlock-date-lbl'),
    value: props.builderProject
      ? time()
          .add(
            duration(
              props.builderProject?.withdrawLockPeriodAfterDeposit / 1000,
              'seconds',
            ).asSeconds,
            'seconds',
          )
          .format(DEFAULT_TIME_FORMAT)
      : '',
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
    const tx = await buildersContract.value?.contractInstance.deposit(
      props.builderProject?.id,
      toEther(form.stakeAmount),
    )

    if (!tx) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      config.networksMap[networkId.value].l1.explorerUrl,
      tx.hash,
    )

    bus.emit(
      BUS_EVENTS.success,
      t('builders-stake-modal.stake-success-msg', { explorerTxUrl }),
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

.stake-modal__callout-text {
  font-size: toRem(20);
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
