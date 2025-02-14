<template>
  <div
    :class="
      cn(
        'builders-table-item relative hidden w-full',
        'md:grid md:grid-cols-[max(216px),max(48px),max(160px),max(190px),1fr,1fr]',
        'md:h-[72px] md:items-center md:gap-2 md:px-8 md:py-4',
      )
    "
  >
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <img
          v-if="logo"
          :src="logo"
          class="aspect-square size-10 min-w-10 object-cover object-center"
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
    <template v-if="builderProject.chain">
      <div class="builders-table-item__col">
        <div class="builders-table-item__col-content">
          <img
            :src="
              $config.chainsMap[getEthereumChainsName(builderProject.chain)]
                .iconUrls?.[0]
            "
            :alt="
              $config.chainsMap[getEthereumChainsName(builderProject.chain)]
                .chainName
            "
            class="ml-1 h-4 w-4"
          />
        </div>
      </div>
    </template>
    <div class="builders-table-item__col">
      <div
        class="builders-table-item__col-content"
        :title="builderMeta?.rewardType"
      >
        <span class="builders-table-item__col-text text-right">
          {{ builderMeta?.rewardType }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ formatBalance(builderProject.minStake, 18) }}
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{
            Number(formatBalance(builderProject.totalStaked)).toLocaleString(
              'en-US',
              { maximumFractionDigits: 0 },
            )
          }}
          <span class="ml-2 text-xs text-textTertiaryMain">
            {{ builderProject.totalUsers }} {{ $t('staking') }}
          </span>
        </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text text-right">
          {{ humanizeTime(+builderProject.withdrawLockPeriodAfterStake) }}
        </span>
      </div>
      <RouterLink
        class="absolute left-0 top-0 z-10 size-full"
        :to="{
          name: $routes.appBuildersItem,
          params: { id: builderProject.id },
          query: { chain: builderProject.chain },
        }"
      ></RouterLink>
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
        query: { chain: builderProject.chain },
      }"
    >
      <img
        v-if="builderMeta?.localImage"
        :src="builderMeta?.localImage"
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

      <img
        v-if="builderProject.chain"
        :src="
          $config.chainsMap[getEthereumChainsName(builderProject.chain)]
            .iconUrls?.[0]
        "
        :alt="
          $config.chainsMap[getEthereumChainsName(builderProject.chain)]
            .chainName
        "
        class="absolute right-5 top-5 ml-1 h-5 w-5"
      />
    </RouterLink>

    <div
      class="flex flex-col border-0 border-t border-solid border-[#FFFFFF29]"
    >
      <div class="grid grid-cols-2 place-items-center">
        <span class="w-full py-3 text-center text-textTertiaryMain">
          {{
            $t('builders-table-item.mobile-min-deposit-lbl', {
              amount: formatBalance(builderProject.minStake),
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
                +builderProject.withdrawLockPeriodAfterStake,
              ),
            })
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatBalance, humanizeTime } from '@/helpers'
import { BuilderProject } from '@/types'
import { cn } from '@/theme/utils'
import predefinedBuildersMeta from '@/assets/predefined-builders-meta.json'
import { getEthereumChainsName } from '@config'
import { computed } from 'vue'

const props = defineProps<{
  builderProject: BuilderProject
}>()

const builderMeta = predefinedBuildersMeta.find(
  el => el.name.toLowerCase() === props.builderProject.name.toLowerCase(),
)

const logo = computed(() => {
  return props.builderProject.image || builderMeta?.localImage || ''
})
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
  font-weight: 400;
  line-height: toRem(24);
  color: var(--text-primary-invert-main);
  font-size: toRem(17);

  @apply overflow-hidden text-ellipsis;

  .builders-table-item__col:not(:first-child) & {
    margin-left: auto;
  }
}
</style>
