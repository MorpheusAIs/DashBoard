<template>
  <div
    :class="
      cn(
        'builders-table-item relative hidden w-full',
        'md:grid md:grid-cols-[max(216px),max(160px),max(190px),1fr,1fr,max(100px)]',
        'md:h-[72px] md:items-center md:gap-2 md:px-8 md:py-4',
      )
    "
  >
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <img
          v-if="avatarUri"
          :src="avatarUri"
          class="aspect-square size-10 min-w-10"
        />
        <div
          v-else
          class="flex size-10 min-w-10 items-center justify-center bg-errorMain"
        >
          {{ builderProject.name[0] }}
        </div>
        <span class="builders-table-item__col-text">
          {{ builderProject.name }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div
        class="builders-table-item__col-content"
        :title="time(+builderProject.startsAt).format(DOT_TIME_FORMAT)"
      >
        <span class="builders-table-item__col-text">
          {{ time(+builderProject.startsAt).format(DOT_TIME_FORMAT) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ formatBalance(builderProject.minimalDeposit) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ formatBalance(builderProject.totalStaked) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text text-right">
          {{ humanizeTime(+builderProject.withdrawLockPeriodAfterDeposit) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col justify-end">
      <RouterLink
        class="absolute left-0 top-0 z-10 size-full"
        :to="{
          name: $routes.appBuildersItem,
          params: { id: builderProject.id },
        }"
      ></RouterLink>
      <app-button
        class="z-20 mx-auto"
        color="secondary"
        size="small"
        @click="isStakeModalShown = true"
      >
        {{ $t('builders-table-item.stake-btn') }}
      </app-button>
    </div>
  </div>

  <div
    :class="
      cn(
        'bg-gradient-to-r',
        'from-[#39633a0a] from-0%',
        'to-[#26393980] to-100%',
        'relative flex flex-col',
        'border border-solid border-[#FFFFFF29]',
        'md:hidden',
      )
    "
  >
    <RouterLink
      class="flex items-center gap-4 p-6"
      :to="{
        name: $routes.appBuildersItem,
        params: { id: builderProject.id },
      }"
    >
      <img
        v-if="avatarUri"
        :src="avatarUri"
        class="aspect-square size-[75px] min-w-[75px]"
      />
      <div
        v-else
        class="flex size-[75px] min-w-[75px] items-center justify-center bg-errorMain"
      >
        {{ builderProject.name[0] }}
      </div>
      <span class="text-textSecondaryMain typography-h4">
        {{ builderProject.name }}
      </span>
    </RouterLink>

    <div
      class="flex flex-col border-0 border-t border-solid border-[#FFFFFF29]"
    >
      <div class="grid grid-cols-2 place-items-center">
        <span class="w-full py-3 text-center text-textTertiaryMain">
          {{
            $t('builders-table-item.mobile-min-deposit-lbl', {
              amount: formatBalance(builderProject.minimalDeposit),
            })
          }}
        </span>
        <span
          :class="
            cn(
              'w-full  py-3 text-center text-textTertiaryMain',
              'border-0 border-l border-solid border-[#FFFFFF29]',
            )
          "
        >
          {{
            $t('builders-table-item.mobile-withdraw-lock-period-lbl', {
              period: humanizeTime(
                +builderProject.withdrawLockPeriodAfterDeposit,
              ),
            })
          }}
        </span>
        <div
          class="col-span-2 w-full border-0 border-t border-solid border-[#FFFFFF29]"
        >
          <button
            class="z-20 h-12 w-full text-[16px] font-medium text-textSecondaryMain"
            @click="isStakeModalShown = true"
          >
            {{ $t('builders-table-item.stake-btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <builders-stake-modal
    v-model:is-shown="isStakeModalShown"
    :builder-project="builderProject"
    @staked="handleStaked"
  />
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { formatBalance, humanizeTime } from '@/helpers'
import { GetBuildersProjectsQuery } from '@/types/graphql'
import { DOT_TIME_FORMAT } from '@/const'
import { time } from '@distributedlab/tools'
import BuildersStakeModal from '@/pages/Builders/components/BuildersStakeModal.vue'
import { inject, ref } from 'vue'
import { cn } from '@/theme/utils'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'

const props = withDefaults(
  defineProps<{
    builderProject: GetBuildersProjectsQuery['buildersProjects'][0]
  }>(),
  {},
)

const reloadBuildersProjects = inject<() => Promise<void>>(
  'reloadBuildersProjects',
)

const isStakeModalShown = ref(false)

const avatarUri = predefinedBuildersMeta.find(
  el => el.name.toLowerCase() === props.builderProject.name.toLowerCase(),
)?.localImage

const handleStaked = async () => {
  isStakeModalShown.value = false
  reloadBuildersProjects?.()
}
</script>

<style scoped lang="scss">
.builders-table-item {
  background: linear-gradient(
    95.36deg,
    rgba(57, 99, 58, 0.04) 0%,
    rgba(38, 57, 57, 0.5) 56.4%
  );
  border: toRem(1) solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    95.36deg,
    rgba(255, 255, 255, 0.48) 0%,
    rgba(255, 255, 255, 0.08) 100%
  );

  &:hover {
    border-image-source: linear-gradient(
      95.36deg,
      rgba(3, 255, 133, 0.48) 0%,
      rgba(3, 255, 133, 0.08) 100%
    );
  }
}

.builders-table-item__col {
  @apply flex w-full items-center gap-2 justify-self-end overflow-hidden;

  &:first-child {
    justify-self: start;
  }
}

.builders-table-item__col-content {
  @apply flex w-full items-center gap-2 pr-2;
}

.builders-table-item__col-text {
  font-size: toRem(18);
  font-weight: 400;
  line-height: toRem(24);
  color: var(--text-primary-invert-main);

  @apply overflow-hidden text-ellipsis;

  .builders-table-item__col:not(:first-child) & {
    margin-left: auto;
  }
}
</style>
