<template>
  <div class="complex-form">
    <div class="complex-form__row">
      <div class="complex-form__field">
        <input-field
          label="form.field1"
          v-model="form.field1"
          :error-message="getFieldErrorMessage('field1')"
          @blur="touchField('field1')"
        />
      </div>
      <div class="complex-form__field">
        <input-field
          label="form.nested.field2"
          v-model="form.nested.field2"
          :error-message="getFieldErrorMessage('nested.field2')"
          @blur="touchField('nested.field2')"
        />
      </div>
    </div>
    <div class="complex-form__row">
      <div
        v-for="(item, idx) in form.array"
        :key="idx"
        class="complex-form__field"
      >
        <input-field
          label="form.array[idx]"
          v-model="form.array[idx]"
          :error-message="getFieldErrorMessage(`array[${idx}]`)"
          @blur="touchField(`array[${idx}]`)"
        />
      </div>
    </div>
    <div class="complex-form__row">
      <div
        v-for="(item, idx) in form.nested.array"
        :key="idx"
        class="complex-form__field"
      >
        <input-field
          label="form.nested.array[idx]"
          v-model="form.nested.array[idx]"
          :error-message="getFieldErrorMessage(`nested.array[${idx}]`)"
          @blur="touchField(`nested.array[${idx}]`)"
        />
      </div>
    </div>
    <div class="complex-form__row">
      <div
        v-for="(item, idx) in form.arrayNested"
        :key="idx"
        class="complex-form__field"
      >
        <input-field
          label="form.arrayNested[idx].field"
          v-model="form.arrayNested[idx].field"
          :error-message="getFieldErrorMessage(`arrayNested[${idx}].field`)"
          @blur="touchField(`arrayNested[${idx}].field`)"
        />
      </div>
    </div>
    <div class="complex-form__actions">
      <app-button
        class="complex-form__submit-btn"
        type="submit"
        text="Submit"
        :disabled="isFormDisabled"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppButton } from '@/common'
import { InputField } from '@/fields'

import { useForm, useFormValidation } from '@/composables'
import { reactive } from 'vue'
import { required } from '@/helpers'

const form = reactive({
  field1: '',
  nested: {
    field2: '',
    array: ['', ''],
  },
  array: ['', '', ''],
  arrayNested: [{ field: '' }, { field: '' }],
})

const { isFormDisabled } = useForm()
const { getFieldErrorMessage, touchField } = useFormValidation(form, {
  field1: { required },
  nested: {
    field2: { required },
    array: {
      ...form.nested.array.reduce(
        (acc, curr, idx) => ({
          ...acc,
          [idx]: { required },
        }),
        {},
      ),
    },
  },
  array: {
    ...form.array.reduce(
      (acc, curr, idx) => ({
        ...acc,
        [idx]: { required },
      }),
      {},
    ),
  },
  arrayNested: {
    ...form.arrayNested.reduce(
      (acc, curr, idx) => ({
        ...acc,
        [idx]: { field: { required } },
      }),
      {},
    ),
  },
})
</script>

<style lang="scss" scoped>
.complex-form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: toRem(24);
}

.complex-form__row {
  display: grid;
  align-items: flex-start;
  grid-template-columns: repeat(auto-fill, minmax(toRem(300), 1fr));
  gap: toRem(24);
}

.complex-form__field {
  width: 100%;
}

.complex-form__actions {
  display: flex;
  align-items: center;
  gap: toRem(24);
}

.complex-form__submit-btn {
  width: 100%;
}
</style>
