<template>
  <div class="regist-wrap">
    <div class="input-wrap _regist" v-for="(field, index) in fields" :key="index"
      :class="{ active: formFields.isActive[field.name] }" :style="getStyle(field.name)">
      <div class="input__wrap underline-type">
        <div class="input__item">
          <div class="input__item_inner">
            <input type="text" class="input__element" v-model="field.model.value"
              @input="handleInput(field.name, index)" :readOnly="formFields.select[field.name]"
              @click="handleClick(field.name, index)" />
            <label :for="`regist${field.label}`" :class="{ active: formFields.labelFields[field.name] }">
              {{ t(field.translationKey) }}
            </label>
          </div>
        </div>
        <button v-if="formFields.verification[field.name]" type="button" class="button button--primary">
          {{ t('signUpView.duplicationCheck') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IField, IFormFields, ISelectItem } from '@/types/interface';
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ fields: IField[], formFields: IFormFields, isFilled: Boolean }>();
const emits = defineEmits(['update:formFields', 'openSelectForIndustry', 'openSelectForCountry']);

const { t } = useI18n();

const isVisible = (field: string) => props.formFields.visibleFields[field];
const getStyle = (field: string) => {
  return isVisible(field) ? 'display: block;' : 'display: none;';
};

const handleInput = (field: string, index: number) => {
  props.formFields.labelFields[field] = true;
  if (index < props.fields.length && index >= 0) {
    const nextField = props.fields[index - 1].name;
    props.formFields.visibleFields[nextField] = true;
    setTimeout(() => {
      props.formFields.isActive[field] = true;
      props.formFields.isActive[nextField] = true;
    }, 1000);
  }
  emits('update:formFields', props.formFields);
};

const handleClick = (field: string, index: number) => {
  if (field === 'industry' || field === 'country') {
    if (field === 'industry') {
      props.formFields.labelFields[field] = true;
      emits('openSelectForIndustry');
    }
    if (field === 'country') {
      props.formFields.labelFields[field] = true;
      emits('openSelectForCountry');
    }
    if (index < props.fields.length && index >= 0) {
      const nextField = props.fields[index - 1].name;
      props.formFields.visibleFields[nextField] = true;
      setTimeout(() => {
        props.formFields.isActive[field] = true;
        props.formFields.isActive[nextField] = true;
      }, 1000);
    }
  }
};

const makeAllTrue = async () => {
  Object.keys(props.formFields.isActive).forEach(key => {
    props.formFields.isActive[key] = true;
  });
  Object.keys(props.formFields.labelFields).forEach(key => {
    props.formFields.labelFields[key] = true;
  });
  Object.keys(props.formFields.visibleFields).forEach(key => {
    props.formFields.visibleFields[key] = true;
  });
};

watch(() => props.isFilled, (newVal) => {
  if (newVal) {
    makeAllTrue();
    emits('update:formFields', { ...props.formFields });
  }
});

onMounted(async () => {
  if (props.isFilled) {
    await makeAllTrue();
    emits('update:formFields', { ...props.formFields });
  }
});
</script>
