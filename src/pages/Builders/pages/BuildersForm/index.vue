<template>
  <form
    @submit.prevent="submit"
    class="mx-auto flex w-full max-w-[1030px] flex-col"
  >
    <div class="mx-auto mb-12 flex flex-col gap-6 text-center">
      <h2 class="typography-h1">
        {{
          !!loadedData.buildersProject
            ? $t('builders-form.update-title')
            : $t('builders-form.create-title')
        }}
      </h2>

      <span class="typography-body3">
        {{ $t('builders-form.subtitle') }}
      </span>
    </div>

    <div class="flex flex-col gap-6">
      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-1-title') }}
        </span>

        <input-field
          v-model="form.name"
          :placeholder="$t('builders-form.name-plh')"
          :note="$t('builders-form.name-note')"
          :error-message="getFieldErrorMessage('name')"
          @blur="touchField('name')"
          :disabled="isSubmitting || !!loadedData.buildersProject"
        />
        <input-field
          v-model="form.address"
          :placeholder="$t('builders-form.address-plh')"
          :note="$t('builders-form.address-note')"
          :error-message="getFieldErrorMessage('address')"
          @blur="touchField('address')"
          :disabled="isSubmitting"
        />

        <input-field
          v-model="form.website"
          :placeholder="$t('builders-form.website-plh')"
          :note="$t('builders-form.website-note')"
          :error-message="getFieldErrorMessage('website')"
          @blur="touchField('website')"
          :disabled="isSubmitting"
        />

        <input-field
          v-model="form.imageUrl"
          :placeholder="$t('builders-form.image-url-plh')"
          :note="$t('builders-form.image-url-note')"
          :error-message="getFieldErrorMessage('imageUrl')"
          @blur="touchField('imageUrl')"
          :disabled="isSubmitting"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-2-title') }}
        </span>

        <datetime-field
          v-model="form.startAt"
          :placeholder="$t('builders-form.start-at-plh')"
          :note="$t('builders-form.start-at-note')"
          :error-message="getFieldErrorMessage('startAt')"
          @blur="touchField('startAt')"
          :disabled="isSubmitting || !!loadedData.buildersProject"
        />
        <input-field
          v-model="form.lockPeriodAfterStake"
          :placeholder="$t('builders-form.lock-period-after-stake-plh')"
          :note="$t('builders-form.lock-period-after-stake-note')"
          :error-message="getFieldErrorMessage('lockPeriodAfterStake')"
          @blur="touchField('lockPeriodAfterStake')"
          :disabled="isSubmitting || !!loadedData.buildersProject"
          type="number"
        />
        <input-field
          v-model="form.minStake"
          :placeholder="$t('builders-form.min-deposit-plh')"
          :note="$t('builders-form.min-deposit-note')"
          :error-message="getFieldErrorMessage('minStake')"
          @blur="touchField('minStake')"
          :disabled="isSubmitting"
        />
        <datetime-field
          v-model="form.minClaimLockEnd"
          :placeholder="$t('builders-form.claim-lock-end-plh')"
          :note="$t('builders-form.claim-lock-end-note')"
          :error-message="getFieldErrorMessage('minClaimLockEnd')"
          @blur="touchField('minClaimLockEnd')"
          :disabled="isSubmitting || !!loadedData.buildersProject"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <span class="col-span-2 mb-2 typography-h2">
          {{ $t('builders-form.section-3-title') }}
        </span>

        <input-field
          v-model="form.emissionsFee"
          :placeholder="$t('builders-form.emissions-fee-plh')"
          :note="$t('builders-form.emissions-fee-note')"
          :error-message="getFieldErrorMessage('emissionsFee')"
          @blur="touchField('emissionsFee')"
          :disabled="isSubmitting || !!loadedData.buildersProject"
        />
        <input-field
          v-model="form.treasuryFee"
          :placeholder="$t('builders-form.treasury-fee-plh')"
          :note="$t('builders-form.treasury-fee-note')"
          :error-message="getFieldErrorMessage('treasuryFee')"
          @blur="touchField('treasuryFee')"
          :disabled="isSubmitting"
        />
      </app-gradient-border-card>

      <app-gradient-border-card class="grid grid-cols-2 gap-6 p-10">
        <div class="col-span-2 flex gap-5">
          <span class="mb-2 text-textSecondaryMain typography-h2">
            {{ $t('builders-form.section-4-title') }}
          </span>
          <span
            class="col-span-2 mb-2 !font-light text-[#CCCCCC] typography-h2"
          >
            {{ $t('builders-form.optional-mark') }}
          </span>
        </div>

        <input-field
          class="col-span-2"
          v-model="form.slug"
          :placeholder="$t('builders-form.slug-plh')"
          :note="$t('builders-form.slug-note')"
          :error-message="getFieldErrorMessage('slug')"
          @blur="touchField('slug')"
          :disabled="isSubmitting"
        />
        <textarea-field
          class="col-span-2"
          v-model="form.description"
          :placeholder="$t('builders-form.description-plh')"
          :note="$t('builders-form.description-note')"
          :error-message="getFieldErrorMessage('description')"
          @blur="touchField('description')"
          :disabled="isSubmitting"
        />
      </app-gradient-border-card>
    </div>

    <div class="mt-10 flex items-center justify-center gap-4">
      <app-button
        scheme="filled"
        color="secondary"
        :disabled="isSubmitting"
        @click="$router.back()"
      >
        {{ $t('builders-form.cancel-btn') }}
      </app-button>
      <app-button type="submit" :disabled="!isFieldsValid || isSubmitting">
        {{ $t('builders-form.submit-btn') }}
      </app-button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { AppGradientBorderCard, AppButton } from '@/common'
import {
  BuilderSubnetDefaultFragment,
  GetBuilderSubnet,
  GetBuilderSubnetQuery,
  GetBuilderSubnetQueryVariables,
} from '@/types/graphql'

import { InputField, DatetimeField, TextareaField } from '@/fields'
import { storeToRefs, useWeb3ProvidersStore } from '@/store'
import {
  bus,
  BUS_EVENTS,
  ErrorHandler,
  getEthExplorerTxUrl,
  sleep,
} from '@/helpers'
import { computed, reactive, ref, watch } from 'vue'
import { useFormValidation, useI18n, useLoad } from '@/composables'
import { maxLength, minValue, required, validUrl } from '@/validators'
import { formatEther, parseUnits } from '@/utils'
import { helpers } from '@vuelidate/validators'
import { time } from '@distributedlab/tools'
import { DOT_TIME_FORMAT } from '@/const'
import { useRoute, useRouter } from 'vue-router'
import { useSecondApolloClient } from '@/composables/use-second-apollo-client'
import { ROUTE_NAMES } from '@/enums'

defineOptions({
  inheritAttrs: false,
})

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const { provider, builderSubnetsContract, builderSubnetsContractDetails } =
  storeToRefs(useWeb3ProvidersStore())

const { client: buildersApolloClient, clients } = useSecondApolloClient()

const currentClient = computed(() => {
  const client = Object.entries(clients.value).find(
    item => item[0] === route.query.chain,
  )?.[1]

  return client || buildersApolloClient.value
})

const { data: loadedData } = useLoad<{
  minimalWithdrawLockPeriod: number
  buildersProject: BuilderSubnetDefaultFragment | null
}>(
  {
    minimalWithdrawLockPeriod: 0,
    buildersProject: null,
  },
  async () => {
    const minWithdrawLockPeriod =
      await builderSubnetsContract.value.providerBased.value.minWithdrawLockPeriodAfterStake()

    const [{ data: buildersProjectsResponse }] = await Promise.all([
      currentClient.value.query<
        GetBuilderSubnetQuery,
        GetBuilderSubnetQueryVariables
      >({
        query: GetBuilderSubnet,
        fetchPolicy: 'network-only',
        variables: {
          id: route.params.id as string,
        },
      }),
    ])

    return {
      minimalWithdrawLockPeriod: minWithdrawLockPeriod.toNumber(),
      buildersProject: buildersProjectsResponse.builderSubnet ?? null,
    }
  },
  {
    reloadArgs: [route],
  },
)

const isSubmitting = ref(false)

const form = reactive<{
  name: string
  address: string
  website: string
  imageUrl: string

  startAt: string
  lockPeriodAfterStake: string
  minStake: string
  minClaimLockEnd: string

  emissionsFee: string
  treasuryFee: string

  slug: string
  description: string
}>({
  name: loadedData.value.buildersProject?.name ?? '',
  address: loadedData.value.buildersProject?.owner ?? '',
  website: loadedData.value.buildersProject?.website ?? '',
  imageUrl: loadedData.value.buildersProject?.image ?? '',

  startAt: loadedData.value.buildersProject?.startsAt ?? '',
  lockPeriodAfterStake:
    loadedData.value.buildersProject?.withdrawLockPeriodAfterStake ?? '',
  minStake: formatEther(loadedData.value.buildersProject?.minStake ?? 0),
  minClaimLockEnd: +loadedData.value.buildersProject?.minClaimLockEnd
    ? loadedData.value.buildersProject?.minClaimLockEnd
    : '',

  emissionsFee: '',
  treasuryFee: '',

  slug: '',
  description: '',
})

watch(loadedData, val => {
  form.name = val.buildersProject?.name ?? ''
  form.address = val.buildersProject?.owner ?? ''
  form.website = val.buildersProject?.website ?? ''
  form.imageUrl = val.buildersProject?.image ?? ''

  form.startAt = val.buildersProject?.startsAt ?? ''
  form.lockPeriodAfterStake =
    val.buildersProject?.withdrawLockPeriodAfterStake ?? ''
  form.minStake = formatEther(val.buildersProject?.minStake ?? 0)
  form.minClaimLockEnd = +val.buildersProject?.minClaimLockEnd
    ? val.buildersProject?.minClaimLockEnd
    : ''
})

const { getFieldErrorMessage, isFieldsValid, isFormValid, touchField } =
  useFormValidation(
    form,
    computed(() => ({
      name: { required },
      address: { required },
      website: { validUrl },
      imageUrl: { validUrl },

      startAt: { required },
      lockPeriodAfterStake: {
        required,
        minValue: minValue(loadedData.value.minimalWithdrawLockPeriod),
      },
      minStake: { required },
      minClaimLockEnd: {
        required,
        minValue: helpers.withMessage(
          form.startAt
            ? t('builders-form.min-end-time-validation-err-msg', {
                time: time(+form.startAt).format(DOT_TIME_FORMAT),
              })
            : t('builders-form.min-end-time-validation-need-start-time-msg'),
          minValue(Number(form.startAt)),
        ),
      },

      emissionsFee: { required },
      treasuryFee: { required },

      slug: { maxLength: maxLength(120) },
      description: { maxLength: maxLength(800) },
    })),
  )

const submit = async () => {
  if (!isFormValid()) return

  isSubmitting.value = true

  try {
    if (
      provider.value.chainId !==
      builderSubnetsContractDetails.value.targetChainId
    ) {
      provider.value.selectChain(
        builderSubnetsContractDetails.value.targetChainId,
      )
      await sleep(1_000)
    }

    const tx = loadedData.value.buildersProject
      ? await builderSubnetsContract.value?.signerBased.value.editSubnetMetadata(
          loadedData.value.buildersProject.id,
          {
            slug: form.slug,
            description: form.description,
            website: form.website,
            image: form.imageUrl,
          },
        )
      : await builderSubnetsContract.value?.signerBased.value.createSubnet(
          {
            name: form.name,
            owner: provider.value.selectedAddress,
            minStake: parseUnits(form.minStake),
            fee: form.emissionsFee,
            feeTreasury: form.treasuryFee,
            startsAt: form.startAt,
            withdrawLockPeriodAfterStake: form.lockPeriodAfterStake,
            minClaimLockEnd: form.minClaimLockEnd,
          },
          {
            slug: form.slug,
            description: form.description,
            website: form.website,
            image: form.imageUrl,
          },
        )

    const txReceipt = await tx.wait()

    if (!txReceipt) throw new TypeError('Transaction is not defined')

    const explorerTxUrl = getEthExplorerTxUrl(
      builderSubnetsContractDetails.value.explorerUrl,
      txReceipt.transactionHash,
    )

    await sleep(1000)

    const poolId =
      await builderSubnetsContract.value?.signerBased.value.getSubnetId(
        form.name,
      )

    await sleep(2000)

    bus.emit(
      BUS_EVENTS.success,
      t('builders-form.confirm-success-msg', { explorerTxUrl }),
    )

    await router.push({
      name: ROUTE_NAMES.appBuildersItem,
      params: {
        id: loadedData.value.buildersProject?.id ?? poolId,
      },
    })
  } catch (error) {
    ErrorHandler.process(error)
  }

  isSubmitting.value = false
}
</script>

<style lang="scss"></style>
