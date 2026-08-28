# Common Gotchas & Quick Reference

## Image URLs

TMDB returns relative paths. Always prepend `IMAGE_BASE_URL` from `@/constants/MovieApiBase`:
```ts
import { IMAGE_BASE_URL } from '@/constants/MovieApiBase';
const fullUrl = `${IMAGE_BASE_URL}${movie.poster_path}`;
```

## Navigation

- For static routes, use the `navigate()` helper from `@/constants/ScreenRoutes` (supports push, replace, back, dismissAll, dismissTo)
- For dynamic routes like `movie/[id]`, use `router.push()` directly from `expo-router` — not all routes are in ScreenRoutes
- Route params are typed via Expo's typed routes experiment

## Component Imports

Import shared components from the barrel export, not individual files:
```ts
import { Screen, Text, Button, Icon } from '@/components';
```

## API Route Builders

`MovieApiRoutes` in `@/constants/MovieApiRoutes` uses functions for parameterized routes:
```ts
MovieApiRoutes.details(movieId)      // → `movie/${id}`
MovieApiRoutes.trendingAll('day')    // → `/trending/all/day`
MovieApiRoutes.moviesByCategory(cat) // → `/movie/${category}`
```

## Tailwind Custom Colors

Use `dark-{100-800}` and `light-{100-700}` tokens (not default gray/slate). The app is dark-themed, so `dark-600`/`dark-700` are common backgrounds and `light-100` is primary text.
