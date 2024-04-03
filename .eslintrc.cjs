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
	parser: '@typescript-eslint/parser', // TypeScript 파서 추가
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module', // 모듈 시스템 사용 지정
		ecmaFeatures: {
			jsx: true,
		},
		project: './tsconfig.json', // TypeScript 설정 파일 지정
	},
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:@typescript-eslint/eslint-recommended', // TypeScript 규칙 추가
		'plugin:@typescript-eslint/recommended', // TypeScript 권장 규칙 추가
	],
	rules: {
		'linebreak-style': ['error', 'unix'] // Unix 스타일(LF)로 설정
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
