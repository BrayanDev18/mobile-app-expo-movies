import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { View } from 'react-native';
import { MediaListRow } from './MediaListRow';

interface RankedListProps {
  title: string;
  movies: MovieProps[];
}

export const RankedList = ({ title, movies }: RankedListProps) => {
  if (!movies.length) return null;

  return (
    <View>
      <Text className="px-1 !text-[18px] font-semibold">{title}</Text>

      <View className="mt-2">
        {movies.map((item, index) => (
          <View
            key={`${item.mediaType}-${item.id}`}
            className={index < movies.length - 1 ? 'border-b border-white/10' : ''}>
            <MediaListRow movie={item} rank={index + 1} />
          </View>
        ))}
      </View>
    </View>
  );
};
