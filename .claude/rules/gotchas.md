# Common Gotchas & Quick Reference

## Image URLs

Domain models store the raw TMDB path (`movie.poster` is a path, NOT a URL). Resolve the size at render, preferably with the `TmdbImage` component (placeholder + caching baked in), or `tmdbImage(path, size)` for animated/special images:
```tsx
import { TmdbImage } from '@/components';
<TmdbImage path={movie.poster} size="w342" style={...} />
```
`tmdbResize` exists only for gallery images, which are URL-based by contract. `tmdbImage` passes absolute URLs through untouched (legacy persisted data).

## Navigation

- ALL media/person/collection/discover navigation goes through the typed helpers in `@/utils` (`src/utils/navigateMedia.ts`): `openMediaDetails`, `openPersonDetails`, `openCollection`, `openDiscover(mediaType, params)`, `openCastList`, `openGallery`. Never hardcode `/movie/...` or `/tv/...` strings for these.
- `openMediaDetails` branches on `mediaType` — items mapped from TV endpoints carry `mediaType: 'tv'` and route to `tv/[id]`.
- For anything else use `router.push()` from `expo-router`; route params are typed via Expo's typed routes experiment.

## Component Imports

Import shared components from the barrel export, not individual files:
```ts
import { Screen, Text, Button, Icon } from '@/components';
```

## API Route Builders

`MovieApiRoutes` in `@/constants/MovieApiRoutes` uses functions for parameterized routes:
```ts
MovieApiRoutes.details(movieId)      // → `movie/${id}`
MovieApiRoutes.trending('all', 'day') // → `/trending/all/day`
MovieApiRoutes.moviesByCategory(cat) // → `/movie/${category}`
```

## Tailwind Custom Colors

Use `dark-{100-800}` and `light-{100-700}` tokens (not default gray/slate). The app is dark-themed, so `dark-600`/`dark-700` are common backgrounds and `light-100` is primary text.
