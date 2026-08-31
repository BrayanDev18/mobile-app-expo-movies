# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native movie app (Flixora) built with Expo SDK 54, React 19, and React Native 0.81. Uses The Movie Database (TMDB) API. New Architecture and React Compiler experiments are enabled.

## Common Commands

- `bun run start` — Start dev server (Expo Go or dev client)
- `bun run ios` / `bun run android` — Native build and run
- `bun run lint` / `bun run lint:fix` — ESLint
- `bun run typecheck` — `tsc --noEmit`
- `bun run format` — Prettier over `src/`
No test runner is configured. The package manager is bun (`bun.lock`).

## Environment Variables

Copy `.env.example` to `.env` and set:
```
EXPO_PUBLIC_MOVIES_API_BASE_URL=https://api.themoviedb.org/3
EXPO_PUBLIC_MOVIES_API_KEY=<your_tmdb_api_key>
```
Zustand persistence keys are NOT env vars — they live in `src/stores/storageKeys.ts`.

## Path Aliases

Defined in both `tsconfig.json` and babel `module-resolver`:
`@/components`, `@/hooks`, `@/stores`, `@/services`, `@/constants`, `@/utils`, `@/interfaces`, `@/screens`, `@/translate`, `@/assets`
