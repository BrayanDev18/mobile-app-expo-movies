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

i18next + react-i18next with expo-localization for locale detection. Translations in `src/translate/en.ts` and `src/translate/es.ts`. Language preference persisted via Zustand store.
