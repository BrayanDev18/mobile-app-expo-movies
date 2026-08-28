# Architecture

## Routing (Expo Router — file-based)

```
src/app/
├── _layout.tsx          # Root: GestureHandler → QueryClientProvider → Stack
├── index.tsx            # Welcome/onboarding
├── (auth)/sign-in.tsx   # Auth flow
└── (root)/
    ├── (tabs)/          # Bottom tabs: home, explore, myList, profile
    │   └── _layout.tsx  # Custom Material Top Tabs with animated tab bar
    ├── movie/[id].tsx   # Dynamic movie detail route
    ├── movie/cast/[id]  # Cast detail route
    ├── series/          # Series screens
    └── tv/              # TV show screens
```

Typed routes are enabled (`experiments.typedRoutes: true` in app.json). Route constants live in `src/constants/ScreenRoutes.ts`.

## Feature Organization Pattern

Feature-specific logic lives alongside screens, not in global dirs:

```
src/screens/movie/
├── components/   # MovieHeader, MovieTrailers, MovieCastAndCrew, etc.
└── hooks/        # useMovieDetails, useMovieVideos, useMovieCast, etc.
```

Global shared components are in `src/components/` (Screen, Button, Text, Input, Icon, Loader).
