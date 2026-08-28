# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native movie app (Flixora) built with Expo SDK 54, React 19, and React Native 0.81. Uses The Movie Database (TMDB) API. New Architecture and React Compiler experiments are enabled.

## Common Commands

- `npx expo start` — Start dev server (Expo Go or dev client)
- `npx expo run:ios` / `npx expo run:android` — Native build and run
- `npx expo lint` — Run ESLint
No test runner is configured.

## Environment Variables

Copy `.env.example` to `.env` and set:
```
EXPO_PUBLIC_MOVIES_API_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_MOVIES_API_KEY=<your_tmdb_api_key>
EXPO_PUBLIC_LOCALSTORAGE_LANGUAGE_KEY=flixora-languaje-store
EXPO_PUBLIC_LOCALSTORAGE_THEME_KEY=flixora-theme-store
```

## Path Aliases

Defined in both `tsconfig.json` and babel `module-resolver`:
`@/components`, `@/hooks`, `@/stores`, `@/services`, `@/constants`, `@/utils`, `@/interfaces`, `@/types`, `@/screens`, `@/translate`, `@/assets`
