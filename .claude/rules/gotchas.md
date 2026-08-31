# Common Gotchas & Quick Reference

## Image URLs

TMDB returns relative paths. Build URLs with `tmdbImage` from `@/utils` (never concatenate hosts by hand), and resize an already-built URL with `tmdbResize`:
```ts
import { tmdbImage, tmdbResize } from '@/utils';
const fullUrl = tmdbImage(movie.poster_path, 'w342');
const smaller = tmdbResize(movie.poster, 'w185');
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
