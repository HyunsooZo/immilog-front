import { createI18n } from 'vue-i18n';

const loadLocaleMessages = async () => {
	const context = import.meta.globEager('./locales/*.json');
	const messages = {};

	for (const path in context) {
		const matched = path.match(/\/locales\/(.*)\.json$/);
		if (matched && matched.length > 1) {
			const locale = matched[1];
			messages[locale] = context[path].default;
		}
	}

	return messages;
};

const i18n = createI18n({
	locale: 'ko', // 기본 언어 설정
	fallbackLocale: 'en', // 대체 언어 설정
	messages: await loadLocaleMessages(),
});

export default i18n;
