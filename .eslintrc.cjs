// /* eslint-env node */
// require('@rushstack/eslint-patch/modern-module-resolution');

// module.exports = {
// 	root: true,
// 	extends: [
// 		'plugin:vue/vue3-essential',
// 		'eslint:recommended',
// 		'@vue/eslint-config-prettier/skip-formatting',
// 	],
// 	parserOptions: {
// 		ecmaVersion: 'latest',
// 	},
// 	rules: {
// 		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
// 		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
// 		'prettier/prettier': [
// 			'error',
// 			{
// 				singleQuote: true,
// 				semi: true,
// 				useTabs: true,
// 				tabWidth: 2,
// 				trailingComma: 'all',
// 				printWidth: 80,
// 				bracketSpacing: true,
// 				arrowParens: 'avoid',
// 				endOfLine: 'auto', // 한줄 추가
// 			},
// 		],
// 	},
// };
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	parser: 'vue-eslint-parser', // Vue 파서 사용
	parserOptions: {
		parser: '@typescript-eslint/parser', // TypeScript 파서를 Vue 파서 내에서 사용
		ecmaVersion: 'latest',
		sourceType: 'module',
		extraFileExtensions: ['.vue'], // Vue 파일 확장자 추가
		ecmaFeatures: {
			jsx: true,
		},
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:@typescript-eslint/eslint-recommended', // TypeScript 규칙 추가
		'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙 추가
	],
	rules: {
		'linebreak-style': ['error', 'unix'], // Unix 스타일(LF)로 설정
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'prettier/prettier': [
			'error',
			{
				singleQuote: true,
				semi: true,
				useTabs: true,
				tabWidth: 2,
				trailingComma: 'all',
				printWidth: 80,
				bracketSpacing: true,
				arrowParens: 'avoid',
				endOfLine: 'auto',
			},
		],
		// 필요한 경우 TypeScript 관련 추가 규칙 설정
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
