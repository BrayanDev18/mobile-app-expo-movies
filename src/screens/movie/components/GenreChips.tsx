import { openDiscover } from '@/utils';
import { FlashList, Tab } from '@/components';
import { GenreProps, MediaType } from '@/interfaces';
import { useMovieGenres } from '@/hooks';
import { useCallback } from 'react';
import { View } from 'react-native';

export const GenreChips = ({ mediaType = 'movie' }: { mediaType?: MediaType }) => {
  const { genres } = useMovieGenres(mediaType);

  const renderItem = useCallback(
    ({ item }: { item: GenreProps }) => (
      <Tab
        title={item.name}
        isActive={false}
        adaptableWidth
        className="rounded-full border border-white/15"
        onPress={() => openDiscover(mediaType, { genreId: item.id, title: item.name })}
      />
    ),
    [mediaType]
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
