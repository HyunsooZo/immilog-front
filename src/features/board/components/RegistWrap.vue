<template>
	<div class="regist-wrap">
		<div
			class="input-wrap _regist"
			v-for="(field, index) in fields"
			:key="index"
			:class="{ active: formFields.isActive[field.name] }"
			:style="getStyle(field.name)"
		>
			<div class="input__wrap underline-type">
				<div class="input__item">
					<div class="input__item_inner">
						<input
							type="text"
							class="input__element"
							v-model="field.model.value"
							@input="handleInput(field.name, index)"
							:readOnly="formFields.select[field.name]"
							@click="handleClick(field.name, index)"
						/>
						<label
							:for="`regist${field.label}`"
							:class="{ active: formFields.labelFields[field.name] }"
						>
							{{ t(field.translationKey) }}
						</label>
					</div>
				</div>
				<button
					v-if="formFields.verification[field.name]"
					type="button"
					class="button button--primary"
				>
					{{ t('signUpView.duplicationCheck') }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { IField, IFormFields } from '@/shared/types/common';
import { onMounted, watch, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	fields: IField[];
	formFields: IFormFields;
	isFilled: boolean;
}>();
const emits = defineEmits([
	'update:formFields',
	'openSelectForIndustry',
	'openSelectForCountry',
]);

const { t } = useI18n();

// 로컬 formFields 복사본 생성
const updateFormField = (
	path: keyof IFormFields,
	field: string,
	value: any,
) => {
	const updatedFormFields = { ...props.formFields };
	updatedFormFields[path] = { ...updatedFormFields[path], [field]: value };
	emits('update:formFields', updatedFormFields);
};

const isVisible = (field: string) => props.formFields.visibleFields[field];
const getStyle = (field: string) => {
	return isVisible(field) ? 'display: block;' : 'display: none;';
};

const handleInput = (field: string, index: number) => {
	const updatedFormFields = { ...props.formFields };
	updatedFormFields.labelFields = {
		...updatedFormFields.labelFields,
		[field]: true,
	};

	if (index < props.fields.length && index >= 0) {
		const nextField = props.fields[index - 1].name;
		updatedFormFields.visibleFields = {
			...updatedFormFields.visibleFields,
			[nextField]: true,
		};

		setTimeout(() => {
			const finalFormFields = { ...updatedFormFields };
			finalFormFields.isActive = {
				...finalFormFields.isActive,
				[field]: true,
				[nextField]: true,
			};
			emits('update:formFields', finalFormFields);
		}, 1000);
	}

	emits('update:formFields', updatedFormFields);
};

const handleClick = (field: string, index: number) => {
	if (field === 'industry' || field === 'country') {
		const updatedFormFields = { ...props.formFields };
		updatedFormFields.labelFields = {
			...updatedFormFields.labelFields,
			[field]: true,
		};

		if (field === 'industry') {
			emits('openSelectForIndustry');
		}
		if (field === 'country') {
			emits('openSelectForCountry');
		}

		if (index < props.fields.length && index >= 0) {
			const nextField = props.fields[index - 1].name;
			updatedFormFields.visibleFields = {
				...updatedFormFields.visibleFields,
				[nextField]: true,
			};

			setTimeout(() => {
				const finalFormFields = { ...updatedFormFields };
				finalFormFields.isActive = {
					...finalFormFields.isActive,
					[field]: true,
					[nextField]: true,
				};
				emits('update:formFields', finalFormFields);
			}, 1000);
		}

		emits('update:formFields', updatedFormFields);
	}
};

const makeAllTrue = async () => {
	const updatedFormFields = { ...props.formFields };

	// 모든 필드를 true로 설정
	updatedFormFields.isActive = Object.keys(updatedFormFields.isActive).reduce(
		(acc, key) => {
			acc[key] = true;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	updatedFormFields.labelFields = Object.keys(
		updatedFormFields.labelFields,
	).reduce(
		(acc, key) => {
			acc[key] = true;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	updatedFormFields.visibleFields = Object.keys(
		updatedFormFields.visibleFields,
	).reduce(
		(acc, key) => {
			acc[key] = true;
			return acc;
		},
		{} as Record<string, boolean>,
	);

	return updatedFormFields;
};

watch(
	() => props.isFilled,
	async newVal => {
		if (newVal) {
			const updatedFormFields = await makeAllTrue();
			emits('update:formFields', updatedFormFields);
		}
	},
);

onMounted(async () => {
	if (props.isFilled) {
		const updatedFormFields = await makeAllTrue();
		emits('update:formFields', updatedFormFields);
	}
});
</script>
