<template>
  <div class="builders-table-item">
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text">
          {{ abbrCenter('0xb51aosudh0a9sdkfamsdkAFe2') }}
        </span>
        <copy-button content="asdfasdf" message="aasdfasdf" />
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text"> Kyle Back Up </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text"> 01.01.2024 05:12 </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text"> 253.9719 </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text"> 253.9719 </span>
      </div>
    </div>
    <div class="builders-table-item__col">
      <div class="builders-table-item__col-content">
        <span class="builders-table-item__col-text"> 40d 20h 20m 15s </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CopyButton } from '@/common'
import { abbrCenter } from '@/helpers'
</script>

<style scoped lang="scss">
.builders-table-item {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  height: toRem(72);
  width: 100%;
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

  padding: toRem(24) toRem(32);
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
}
</style>
