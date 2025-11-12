import { i18n } from './i18n';

/**
 * Translates text.
 * @param key
 * @param {i18n.TranslateOptions} options - The i18n options.
 * @returns {string} - The translated text.
 * @example
 * Translations:
 *
 * ```en.ts
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```ts
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */

export function translate(key: string, options = {}) {
  const text = i18n.t(key, options);
  return text.includes('[missing') ? key : text;
}
