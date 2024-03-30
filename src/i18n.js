import { createI18n } from 'vue-i18n';

async function loadLocaleMessages() {
	const locales = import.meta.glob('./locales/*.json');
	const messagePromises = [];

	for (const path in locales) {
		const matched = path.match(/\/locales\/(.*)\.json$/);
		if (matched && matched.length > 1) {
			const locale = matched[1];
			const messagePromise = locales[path]().then(module => {
				return { [locale]: module.default };
			});
			messagePromises.push(messagePromise);
		}
	}

	const loadedMessages = await Promise.all(messagePromises);
	return loadedMessages.reduce(
		(messages, message) => ({ ...messages, ...message }),
		{},
	);
}

async function setupI18n() {
	const messages = await loadLocaleMessages();
	return createI18n({
		legacy: false,
		locale: 'ko',
		fallbackLocale: 'en',
		messages,
	});
}

export default setupI18n;
