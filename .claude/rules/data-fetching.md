---
paths:
  - "src/hooks/**/*"
  - "src/screens/**/hooks/**/*"
  - "src/services/**/*"
  - "src/stores/**/*"
---

# Data Flow

- **Server state**: React Query (`@tanstack/react-query`) with 5min staleTime, 30min gcTime
- **Client state**: Zustand stores with AsyncStorage persistence (`src/stores/`)
- **API layer**: Axios instance at `src/services/api/movies.config.ts` — base URL and API key from env vars

## Hooks Pattern

- Data fetching hooks wrap React Query's `useQuery` and return destructured `{ data, isLoading }`
- Custom hooks are always prefixed with `use`
- Feature-specific hooks live in `src/screens/<feature>/hooks/`, global hooks in `src/hooks/`

## i18n

`i18n-js` + `expo-localization` (initial locale). Copy lives in `src/translate/en.ts` (source of truth, namespaced: `common.*`, `home.*`, `explore.*`, `myList.*`, `profile.*`, `detail.*`, `facts.*`, `person.*`, `errors.*`…) and `src/translate/es.ts` (typed as `Translations`, so a missing/extra key fails `tsc`).

- In components: `const { t } = useTranslate()` from `@/translate` — it subscribes to `useLanguageStore`, so switching language in Profile re-renders immediately. Keys are typed (`TxKeyPath`).
- Outside React (query functions, interceptors): `translate(key)` — uses `i18n.locale`, which the store keeps in sync on `setLanguage` and on rehydrate.
- Plurals: `{ one, other }` entries + `t('myList.titlesSaved', { count })`. Placeholders: `{{name}}`.
- Constants hold keys, not copy (`titleKey`, `labelKey`) — resolve with `t()` at render.
- Dates/money go through `@/utils` formatters, which read `intlLocale()`. TMDB enum values that it always returns in English (status, series type, department) go through `translateTmdbValue`.
- Never hardcode user-visible English (including `accessibilityLabel`s) outside `src/translate/`.
