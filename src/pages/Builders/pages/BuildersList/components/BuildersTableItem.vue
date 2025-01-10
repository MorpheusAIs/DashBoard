<template>
  <div
    class="builders-table-item relative grid h-[72px] w-full grid-cols-6 items-center px-8 py-4"
  >
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <div
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
          {{ formatEther(builderProject.minimalDeposit) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ formatEther(builderProject.totalStaked) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{
            humanizeTime(builderProject.withdrawLockPeriodAfterDeposit / 1000)
          }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <RouterLink
        class="absolute left-0 top-0 z-10 size-full"
        :to="{
          name: $routes.appBuildersItem,
          params: { id: builderProject.id },
        }"
      ></RouterLink>
      <app-button
        class="z-20"
        color="secondary"
        size="small"
        @click="handleStake"
      >
        Stake
      </app-button>
    </div>
  </div>

  <builders-stake-modal
    v-model:is-shown="isStakeModalShown"
    :builder-project="builderProject"
  />
</template>

<script setup lang="ts">
import { AppButton } from '@/common'
import { humanizeTime } from '@/helpers'
import { GetBuildersProjectsQuery } from '@/types/graphql'
import { formatEther } from '@/utils'
import { DOT_TIME_FORMAT } from '@/const'
import { time } from '@distributedlab/tools'
import BuildersStakeModal from '@/pages/Builders/pages/BuildersList/components/BuildersStakeModal.vue'
import { ref } from 'vue'

withDefaults(
  defineProps<{
    builderProject: GetBuildersProjectsQuery['buildersProjects'][0]
  }>(),
  {},
)

const isStakeModalShown = ref(false)

const handleStake = async () => {
  isStakeModalShown.value = true
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
  @apply flex items-center gap-2 justify-self-end;

  &:first-child {
    justify-self: start;
  }
}

.builders-table-item__col-content {
  @apply flex max-w-[150px] items-center gap-2 pr-2;
}

.builders-table-item__col-text {
  font-size: 17px;
  font-weight: 400;
  line-height: 25.5px;
  color: var(--text-primary-invert-main);

  @apply line-clamp-1;
}
</style>
