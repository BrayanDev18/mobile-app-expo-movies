import { Button, Icon, Text } from '@/components';
import { useTrending } from '@/hooks';
import { useProfileStore } from '@/stores';
import { IMAGE_PLACEHOLDER, tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLUMNS = 3;

const TILE_HEIGHTS = [210, 150, 180, 160, 220, 140];

const COLUMN_OFFSETS = [-60, -100, -70];

const FEATURES = [
  { icon: 'TrendingUp', label: 'Fresh trending picks, updated daily' },
  { icon: 'Compass', label: 'Browse by genre, decade, or streaming service' },
  { icon: 'Clapperboard', label: 'Trailers, cast, galleries, and where to watch' },
] as const;

const splitIntoColumns = (uris: string[]) => {
  const cols = Array.from({ length: COLUMNS }, () => ({
    items: [] as { uri: string; height: number }[],
    height: 0,
  }));

  uris.forEach((uri, index) => {
    const height = TILE_HEIGHTS[index % TILE_HEIGHTS.length];
    const shortest = cols.reduce((prev, curr) => (curr.height < prev.height ? curr : prev));

    shortest.items.push({ uri, height });
    shortest.height += height;
  });

  return cols.map((col) => col.items);
};

const MainIndex = () => {
  const { bottom } = useSafeAreaInsets();
  const hasOnboarded = useProfileStore((state) => state.hasOnboarded);
  const completeOnboarding = useProfileStore((state) => state.completeOnboarding);

  // The store rehydrates from AsyncStorage asynchronously — wait for it so
  // returning users don't see the welcome screen flash before the redirect.
  const [hydrated, setHydrated] = useState(useProfileStore.persist.hasHydrated());

  useEffect(() => useProfileStore.persist.onFinishHydration(() => setHydrated(true)), []);

  const { trending } = useTrending('all', 'day');

  const images = trending
    .map((movie) => movie.poster)
    .filter((poster): poster is string => !!poster)
    .slice(0, 21);

  const columns = splitIntoColumns(images);

  if (!hydrated) return <View className="flex-1 bg-dark-700" />;

  if (hasOnboarded) return <Redirect href="/(root)/(tabs)/home" />;

  return (
    <View className="flex-1 bg-dark-700">
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <View
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ rotate: '-8deg' }, { scale: 1.25 }] },
          ]}
          className="flex-row gap-2 px-2">
          {columns.map((column, columnIndex) => (
            <View
              key={columnIndex}
              style={{ flex: 1, gap: 8, marginTop: COLUMN_OFFSETS[columnIndex] }}>
              {column.map((tile, tileIndex) => (
                <Animated.View
                  key={`${tile.uri}-${tileIndex}`}
                  entering={FadeIn.delay((tileIndex * COLUMNS + columnIndex) * 60).duration(400)}>
                  <Image
                    source={{ uri: tmdbImage(tile.uri, 'w342') ?? undefined }}
                    style={{ width: '100%', height: tile.height, borderRadius: 12 }}
                    contentFit="cover"
                    cachePolicy="memory-disk"
                    placeholder={IMAGE_PLACEHOLDER}
                  />
                </Animated.View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <LinearGradient
        colors={['rgba(6,6,6,0)', 'rgba(6,6,6,0.25)', 'rgba(6,6,6,0.9)', '#060606']}
        locations={[0, 0.42, 0.72, 0.92]}
        style={StyleSheet.absoluteFill}
      />

      <View style={{ paddingBottom: bottom + 24 }} className="flex-1 justify-end gap-6 px-6">
        <Animated.View entering={FadeInDown.delay(350).duration(500)} className="gap-2">
          <View className="h-1 w-10 rounded-full bg-blue-500" />

          <Text className="font-black" style={{ fontSize: 56, lineHeight: 58, letterSpacing: -2 }}>
            Flixora
          </Text>

          <Text className="!text-lg leading-7 !text-neutral-300">
            Everything worth watching, in one place.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(500)} className="gap-3">
          {FEATURES.map((feature) => (
            <View key={feature.icon} className="flex-row items-center gap-3">
              <Icon name={feature.icon} size={18} color="#60A5FA" />

              <Text className="flex-1 !text-md !text-neutral-200">{feature.label}</Text>
            </View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(650).duration(500)} className="gap-3">
          <Button
            title="Get started"
            onPress={() => {
              completeOnboarding();
              router.replace('/(root)/(tabs)/home');
            }}
          />

          <Text className="text-center !text-[11px] !text-neutral-400">Powered by TMDB</Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default MainIndex;
