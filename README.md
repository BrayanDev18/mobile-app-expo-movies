# Flixora

A movie & TV discovery app built with Expo SDK 54, React 19, and React Native 0.81, powered by [The Movie Database (TMDB)](https://www.themoviedb.org/). Dark-first, cinematic UI with Satoshi typography.

## Features

- **Home** with a Movies/Series scope toggle: crossfading hero carousel, trending, now playing / airing today, genre, network, and streaming-service rails
- **Detail screens** for movies and series (trailers, cast & crew, seasons and episode lists, gallery, reviews, where to watch, related titles) in a single TMDB request each
- **Explore**: multi-search (movies, series, people), browse by genre, decade, or streaming service, sagas & collections
- **My List**: watchlist / watched / favorites with personal 1–10 ratings, persisted locally
- **Localized content**: the in-app language switch drives every TMDB request
- Infinite discover grids, pull-to-refresh, skeleton loading, and offline-friendly caching via React Query

## Getting started

The project uses [bun](https://bun.sh) (see `bun.lock`):

```bash
bun install
cp .env.example .env      # then set your TMDB key (below)
bun run ios               # or: bun run android / bun run start
```

> First clone: `expo-env.d.ts` is generated — run `bun run start` once before `typecheck` if TypeScript complains about it.

### Environment variables

| Variable | Value |
|---|---|
| `EXPO_PUBLIC_MOVIES_API_BASE_URL` | `https://api.themoviedb.org/3` |
| `EXPO_PUBLIC_MOVIES_API_KEY` | Your TMDB API key — create one free at [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api) |

Without a valid key the app starts but every request fails.

## Scripts

| Script | What it does |
|---|---|
| `bun run start` | Expo dev server |
| `bun run ios` / `bun run android` | Native build and run |
| `bun run lint` / `bun run lint:fix` | ESLint |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run format` | Prettier over `src/` |

No test runner is configured yet.

## Project layout

```
src/
├── app/                  # Expo Router routes (file-based)
│   ├── (root)/(tabs)/    # Bottom tabs: home, explore, myList, profile
│   ├── (root)/movie/     # Movie detail, discover, gallery, videos, cast, collections
│   └── (root)/tv/        # Series detail, season, discover
├── components/           # Shared UI (Screen, Text, SectionTitle, ErrorState, …)
├── screens/
│   ├── movie/            # Movie feature: components + hooks (also hosts shared media UI)
│   └── series/           # Series feature: components + hooks
├── hooks/                # Cross-cutting hooks (debounce, pull-to-refresh, scrollY)
├── services/             # Axios instance, language interceptor, query keys
├── stores/               # Zustand stores (My List, viewed history, language, …)
├── utils/                # TMDB mappers, image helpers, navigation, formatters
├── interfaces/           # Raw TMDB types + app domain models
└── constants/            # API routes, section configs, scopes
```

Conventions live in `.claude/rules/` (architecture, styling, data fetching, quality patterns).

## Credits

Data and images from [TMDB](https://www.themoviedb.org/). This product uses the TMDB API but is not endorsed or certified by TMDB.
