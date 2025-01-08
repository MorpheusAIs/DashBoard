<template>
  <router-view v-slot="{ Component }" class="home-page__view">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup></script>

<style></style>
