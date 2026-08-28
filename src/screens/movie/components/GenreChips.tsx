import { FlashList, Tab } from '@/components';
import { GenreProps } from '@/interfaces';
import { useMovieGenres } from '@/hooks';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

export const GenreChips = () => {
  const { genres } = useMovieGenres();

  const renderItem = useCallback(
    ({ item }: { item: GenreProps }) => (
      <Tab
        title={item.name}
        isActive={false}
        adaptableWidth
        className="rounded-full border border-white/15"
        onPress={() =>
          router.push({
            pathname: '/(root)/movie/discover',
            params: { genreId: item.id, title: item.name },
          })
        }
      />
    ),
    []
  );

  if (!genres.length) return null;

  return (
    <FlashList
      horizontal
      data={genres}
      keyExtractor={(item) => `${item.id}`}
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-4"
      ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
      renderItem={renderItem}
    />
  );
};
