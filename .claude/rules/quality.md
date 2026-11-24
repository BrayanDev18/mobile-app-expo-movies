---
paths:
  - "src/**/*.{ts,tsx}"
---

# Professional Quality Patterns

These rules enforce clean, polished, production-grade patterns when building or modifying screens and components.

## Loading States

Never block the full screen with a spinner when partial content is available. Prefer progressive loading:

```tsx
// BAD — blocks everything
if (isLoadingA || isLoadingB || isLoadingC) return <Loader />;

// GOOD — render available sections, skeleton the rest
<View className="gap-8">
  {isLoadingHeader ? <MovieHeaderSkeleton /> : <MovieHeader data={header} />}
  {isLoadingCast ? <CastSkeleton /> : <MovieCastAndCrew cast={cast} />}
  <MovieTrailers data={trailers} isLoading={isLoadingTrailers} />
</View>
```

Skeleton placeholders should match the real component's dimensions and use `bg-neutral-800 rounded-2xl animate-pulse` (or Reanimated opacity loop).

## Error & Empty States

Every data-dependent section needs three states: loading, empty, and error.

```tsx
// Extract error and refetch from React Query hooks
const { data, isLoading, isError, refetch } = useMoviesByCategory(category);

// Empty state
if (!data?.length && !isLoading) {
  return (
    <View className="items-center justify-center gap-3 py-12">
      <Ionicons name="film-outline" size={48} color="rgba(255,255,255,0.3)" />
      <Text className="!text-neutral-400">No movies found</Text>
    </View>
  );
}

// Error state with retry
if (isError) {
  return (
    <View className="items-center justify-center gap-4 py-12">
      <Ionicons name="cloud-offline-outline" size={48} color="rgba(255,255,255,0.3)" />
      <Text className="!text-neutral-400">Something went wrong</Text>
      <Pressable onPress={() => refetch()} className="rounded-full bg-blue-500/15 px-6 py-2">
        <Text className="text-blue-400 font-medium">Retry</Text>
      </Pressable>
    </View>
  );
}
```

## Pull-to-Refresh

Add `RefreshControl` on scrollable screens that fetch remote data:

```tsx
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      tintColor="rgba(255,255,255,0.6)"
    />
  }
>
```

Coordinate with React Query's `refetch()` for the refresh handler.

## Image Safety

Never trust image URLs from the API. Always handle null paths and load failures:

```tsx
// Null-safe image URI
source={{ uri: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : undefined }}
placeholder={require('@/assets/images/placeholder.png')}
onError={() => setImageFailed(true)}
```

Avoid force-casting: `movie.poster as string`. Check truthiness first.

## FlashList Performance

This project uses FlashList v2 (`@shopify/flash-list` 2.x), where `estimatedItemSize` is no longer needed — do NOT add it. Import `FlashList` from `@/components` (the NativeWind-aware wrapper), never directly from `@shopify/flash-list`.

Use consistent `keyExtractor` format: `String(item.id)`. If duplicates are possible, append index: `` `${item.id}-${index}` ``.

## Touch Targets

Minimum 44×44px on all interactive elements (Apple HIG). Small icons must have padding:

```tsx
// BAD — icon is 20px, touch target too small
<Pressable><Ionicons size={20} /></Pressable>

// GOOD — padded container
<Pressable className="h-11 w-11 items-center justify-center rounded-full">
  <Ionicons size={20} />
</Pressable>
```

## Screen Entrance Animations

A screen's first content may fade in once. Never replay an entrance on frequent switches (tabs, scopes, chips, filters) — those swap instantly. Entrances use a short ease-out timing, never `.springify()` (springs are for gestures). See the Animations section in `styling.md`.

```tsx
import Animated, { Easing, FadeIn, FadeInDown } from 'react-native-reanimated';

const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);

// Detail screen content wrapper (first load only)
<Animated.View entering={FadeIn.duration(300).easing(EASE_OUT)}>

// Staggered section list — 30–80ms per item, capped
<Animated.View entering={FadeInDown.delay(Math.min(index, 8) * 50).duration(250).easing(EASE_OUT)}>

// BAD — re-runs on every tab switch
<Animated.View key={activeTab} entering={FadeIn.duration(250)}>
```

## Haptic Feedback

Add subtle haptics on meaningful interactions (not every tap):

```tsx
import * as Haptics from 'expo-haptics';

// On important button presses (add to list, play trailer, submit)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// On toggle/selection (tabs, filters, favorites)
Haptics.selectionAsync();

// On success/error (form submit result)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

## Accessibility

Every interactive element needs `accessibilityLabel`. Images need descriptive labels:

```tsx
<Pressable
  accessibilityRole="button"
  accessibilityLabel={`View details for ${movie.title}`}
  onPress={...}
>

<Image
  accessibilityLabel={`${movie.title} poster`}
  source={...}
/>

// Section headers
<Text accessibilityRole="header">Cast & Crew</Text>
```

## Null Safety in Rendering

Guard against undefined data before accessing nested properties — API responses can be partial:

```tsx
// BAD — crashes if movieDetails is undefined
<Text>{movieDetails.title}</Text>

// GOOD
{movieDetails?.title && <Text>{movieDetails.title}</Text>}

// For sections that depend on arrays
{cast?.length > 0 && <MovieCastAndCrew cast={cast} />}
```

## Consistent Hook Returns

Data fetching hooks should always expose the full React Query tuple:

```tsx
export const useMoviesByCategory = (category: string) => {
  const { data: movies = [], isLoading, isError, refetch } = useQuery({...});
  return { movies, isLoading, isError, refetch };
};
```

Never swallow `isError` or `refetch` — consumers need them for error/retry UI.
