# Architecture

## Routing (Expo Router — file-based)

```
src/app/
├── _layout.tsx          # Root: GestureHandler → QueryClientProvider → Stack
├── index.tsx            # Welcome/onboarding (persisted hasOnboarded flag)
├── (auth)/sign-in.tsx   # Auth flow (stub)
└── (root)/
    ├── (tabs)/          # Bottom tabs: home (Movies/Series toggle), explore, myList, profile
    │   └── _layout.tsx  # Custom animated floating tab bar
    ├── movie/           # [id] detail, discover, gallery, videos, similar, cast/, collection/
    └── tv/              # [id] detail, season, discover
```

Typed routes are enabled (`experiments.typedRoutes: true` in app.json). Media navigation helpers live in `src/utils/navigateMedia.ts` (see gotchas.md).

## Feature Organization Pattern

Feature-specific logic lives alongside screens, not in global dirs:

```
src/screens/movie/
├── components/   # MovieHeader, MovieTrailers, MovieCastAndCrew, etc.
└── hooks/        # useMovieDetails, useMovieVideos, useMovieCast, etc.
```

Global shared components are in `src/components/` (Screen, Button, Text, Input, Icon, Loader).
