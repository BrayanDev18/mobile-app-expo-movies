import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import { I18nManager } from 'react-native';

// if English isn't your default language, move Translations to the appropriate language file.
import en from './en';
import es from './es';

export const i18n = new I18n();

export const changeLanguage = (lang: string) => {
  if (lang) {
    i18n.locale = lang;
  }
};

i18n.enableFallback = true;

// to use regional locales use { "en-US": enUS } etc
i18n.translations = { en, es };

const fallbackLocale = 'en';
const systemLocale = getLocales()[0];
const systemLocaleTag = systemLocale?.languageTag ?? 'en';

if (Object.prototype.hasOwnProperty.call(i18n.translations, systemLocaleTag)) {
  // if specific locales like en-FI or en-US is available, set it
  i18n.locale = systemLocaleTag;
} else {
  // otherwise try to fallback to the general locale (dropping the -XX suffix)
  const generalLocale = systemLocaleTag.split('-')[0];
  if (Object.prototype.hasOwnProperty.call(i18n.translations, generalLocale)) {
    i18n.locale = generalLocale;
  } else {
    i18n.locale = fallbackLocale;
  }
}

// handle RTL languages
export const isRTL = systemLocale?.textDirection === 'rtl';
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);
