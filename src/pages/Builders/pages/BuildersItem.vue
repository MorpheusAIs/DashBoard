<template>
  <div
    class="mx-[var(--app-padding-left)] mt-6 flex flex-col overflow-y-auto pb-20"
  >
    <button class="flex items-center gap-2">
      <app-icon :name="$icons.arrowLeft" class="size-4 text-textPrimary" />
      <span class="text-textPrimary">Subnets</span>
    </button>

    <div class="mt-14 flex flex-col">
      <span
        class="self-start bg-gradient-to-r from-[var(--primary-main)] to-[var(--primary-dark)] px-3 py-1 text-[#15151D]"
      >
        Your Builder
      </span>
      <div class="flex items-center gap-8">
        <span class="typography-h1">Kyle Back Up</span>

        <div class="flex items-center gap-2">
          <span class="text-primaryMain">Edit</span>
          <app-icon :name="$icons.edit" class="size-6 text-primaryMain" />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-textPrimary">
          {{ abbrCenter('0xaksjdnfkajsdnfkajsdnfkajsndfkjn') }}
        </span>
        <copy-button content="asdfasdf" message="aasdfasdf" />
      </div>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-[18px]">
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <div class="flex items-center justify-between">
            <span class="text-textPrimary"> Start time </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-textPrimary"> 01.01.2024 </span>
            <span class="text-textPrimary"> 05:12 </span>
          </div>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textPrimary"> Min MOR Deposit </span>
          <span class="text-textPrimary"> 253.9719 </span>
        </div>
      </app-gradient-border-card>
      <app-gradient-border-card class="flex-1">
        <div class="flex flex-col gap-8 p-6">
          <span class="text-textPrimary"> Lock Period After Stake </span>
          <span class="text-textPrimary"> 40d 20h 20m 15s</span>
        </div>
      </app-gradient-border-card>
    </div>

    <div class="mt-14 flex gap-[18px]">
      <div class="flex flex-[0.34] flex-col gap-[18px]">
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textPrimary">
                Available MOR for Withdrawal
              </span>

              <app-button size="small" disabled> Withdraw </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textPrimary"> 3.9719 </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Unlock Time: </span>
              <div class="flex items-center gap-2">
                <span class="text-textPrimary"> 01.01.2024 </span>
                <span class="text-textPrimary"> 05:12 </span>
              </div>
            </div>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textPrimary"> Total MOR Claimed </span>
            <span class="text-textPrimary"> 253.9719 </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <span class="text-textPrimary"> Total MOR Staked </span>
            <span class="text-textPrimary"> 253.9719 </span>
          </div>
        </app-gradient-border-card>
        <app-gradient-border-card class="">
          <div class="flex flex-col gap-8 p-6">
            <div class="flex justify-between">
              <span class="text-textPrimary"> Claim lock ends </span>

              <app-button size="small" disabled> Claim </app-button>
            </div>
            <div class="flex items-center gap-8">
              <span class="text-textPrimary"> 01.01.2024 </span>
              <span class="text-textPrimary"> 05:12 </span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-textSecondary"> Admin address: </span>
              <div class="flex items-center gap-2">
                <span class="text-textPrimary">
                  {{ abbrCenter('0xaksjdnfkajsdnfkajsdnfkajsndfkjn') }}
                </span>
                <copy-button content="asdfasdf" message="aasdfasdf" />
              </div>
            </div>
          </div>
        </app-gradient-border-card>
      </div>
      <div class="col-span-2 flex flex-[0.65] flex-col gap-6 pl-12">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="span text-textPrimary">Stakers</span>
            <app-gradient-border-card
              class="bg-transparent p-2 text-textPrimary"
            >
              23
            </app-gradient-border-card>
          </div>
          <app-button>Stake</app-button>
        </div>

        <div class="flex flex-1 flex-col">
          <div class="mb-2 grid grid-cols-2 items-center justify-between">
            <div class="px-20">
              <span class="text-textSecondary">Name / Address</span>
            </div>

            <button class="flex items-center justify-end gap-2 px-20">
              <span class="text-textSecondary">Start time</span>
              <app-icon :name="$icons.sort" class="size-6" />
            </button>
          </div>

          <div class="flex flex-col gap-2">
            <app-gradient-border-card v-for="i in 10" :key="i">
              <div class="grid grid-cols-2">
                <div class="px-20 py-8">
                  <span class="text-textPrimary">0xb51...AFe2</span>
                </div>
                <div class="px-20 py-8 text-end">
                  <span class="text-textPrimary">253.9719</span>
                </div>
              </div>
            </app-gradient-border-card>
          </div>

          <pagination
            class="mt-6 self-center"
            total-items="100"
            current-page="0"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AppButton,
  AppGradientBorderCard,
  AppIcon,
  CopyButton,
  Pagination,
} from '@/common'
import { abbrCenter } from '@/helpers'

defineOptions({
  // inheritAttrs: false,
})
</script>

<style scoped lang="scss"></style>
