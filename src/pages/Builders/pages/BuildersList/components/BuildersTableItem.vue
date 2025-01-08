<template>
  <RouterLink
    class="builders-table-item grid h-[72px] w-full grid-cols-6 items-center px-8 py-6"
    :to="{ name: $routes.appBuildersItem, params: { id: builderProject.id } }"
  >
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ abbrCenter(builderProject.admin) }}
        </span>
        <copy-button :content="builderProject.admin" message="copied" />
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ builderProject.name }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ humanizeTime(builderProject.startsAt / 1000) }}
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
  </RouterLink>
</template>

<script setup lang="ts">
import { CopyButton } from '@/common'
import { abbrCenter, humanizeTime } from '@/helpers'
import { GetBuildersProjectsQuery } from '@/types/graphql'
import { formatEther } from '@/utils'

withDefaults(
  defineProps<{
    builderProject: GetBuildersProjectsQuery['buildersProjects'][0]
  }>(),
  {},
)
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
  &:last-child {
    justify-self: end;
  }
}

.builders-table-item__col-content {
  display: flex;
  align-items: center;
  gap: toRem(8);
  max-width: toRem(150);
}

.builders-table-item__col-text {
  font-size: 17px;
  font-weight: 400;
  line-height: 25.5px;
  color: var(--text-primary-invert-main);

  @apply line-clamp-1;
}
</style>
