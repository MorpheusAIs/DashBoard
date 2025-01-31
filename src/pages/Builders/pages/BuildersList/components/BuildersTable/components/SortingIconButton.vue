<script setup lang="ts">
import { BuildersProject_OrderBy, OrderDirection } from '@/types/graphql'
import { AppIcon } from '@/common'
import { cn } from '@/theme/utils'
import { AdditionalBuildersOrderBy } from '@/enums'

const orderByModel = defineModel<string>('orderByModel')
const orderDirectionModel = defineModel<string>('orderDirectionModel')

const props = withDefaults(
  defineProps<{
    label: string
    orderBy: BuildersProject_OrderBy | AdditionalBuildersOrderBy
  }>(),
  {},
)

const handleClick = () => {
  orderByModel.value = props.orderBy

  if (orderDirectionModel.value === OrderDirection.Asc) {
    orderDirectionModel.value = OrderDirection.Desc

    return
  }

  orderDirectionModel.value = OrderDirection.Asc
}
</script>

<template>
  <button class="flex items-center gap-2" @click="handleClick">
    <span class="line-clamp-1 text-[16px] leading-[24px] text-textTertiaryMain">
      {{ label }}
    </span>
    <div class="flex flex-col">
      <app-icon
        class="size-[10px]"
        :class="
          cn(
            orderByModel === orderBy &&
              orderDirectionModel === OrderDirection.Asc &&
              'text-primaryMain',
          )
        "
        :name="$icons.triangleTop"
      />
      <app-icon
        class="size-[10px] rotate-180"
        :class="
          cn(
            orderByModel === orderBy &&
              orderDirectionModel === OrderDirection.Desc &&
              'text-primaryMain',
          )
        "
        :name="$icons.triangleTop"
      />
    </div>
  </button>
</template>

<style scoped lang="scss"></style>
