<template>
  <div class="regist-wrap">
    <div class="input-wrap _regist" v-for="(field, index) in fields" :key="index"
      :class="{ active: formFields.isActive[field.name] }" :style="getStyle(field.name)">
      <div class="input__wrap underline-type">
        <div class="input__item">
          <div class="input__item_inner">
            <input type="text" class="input__element" :v-model="field.model" @input="handleInput(field.name, index)" />
            <label :for="`regist${field.label}`" :class="{ active: formFields.labelFields[field.name] }">
              {{ t(field.translationKey) }}
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  fields: Array,
  formFields: Object,
});

const emits = defineEmits(['update:formFields']);

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
</script>
