import { createI18n, I18n, I18nOptions } from 'vue-i18n'

interface LocaleMessageObject {
  [key: string]: Record<string, any>
}

const loadLocaleMessages = async (): Promise<LocaleMessageObject> => {
  const locales = import.meta.globEager('./locales/*.json') // 타입스크립트에서는 globEager 사용을 권장
  const messagePromises: Promise<LocaleMessageObject>[] = []

  for (const path in locales) {
    const matched = path.match(/\/locales\/(.*)\.json$/)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      const messagePromise = locales[path]().then((module: { default: Record<string, any> }) => {
        return { [locale]: module.default }
      })
      messagePromises.push(messagePromise)
    }
  }

  const loadedMessages = await Promise.all(messagePromises)
  return loadedMessages.reduce(
    (messages: LocaleMessageObject, message: LocaleMessageObject) => ({ ...messages, ...message }),
    {}
  )
}

const setupI18n = async (): Promise<I18n> => {
  const messages = await loadLocaleMessages()
  const options: I18nOptions = {
    legacy: false,
    locale: 'en',
    fallbackLocale: 'ko',
    messages
  }
  return createI18n(options)
}

export default setupI18n
