import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { cn, formatDate } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface MovieCardProps {
  onPress?: () => void;
  variant?: 'poster' | 'backdrop';
  width?: number;
  height?: number;
  rating?: number;
  className?: string;
  movie: MovieProps;
}

export const MovieCard = (props: MovieCardProps) => {
  const { onPress, variant = 'poster', width, height, movie, className } = props;

  const isBackdrop = variant === 'backdrop';

  const cardWidth = width ?? (isBackdrop ? 300 : 170);
  const cardHeight = height ?? (isBackdrop ? undefined : 220);
  const movieImage = variant === 'backdrop' ? movie.backdrop : movie.poster;

  return (
    <Pressable
      style={{ width: cardWidth }}
      className={cn(className, 'relative rounded-bl-2xl rounded-br-2xl bg-neutral-950/30')}
      onPress={onPress}>
      <View>
        <Image
          source={{ uri: movieImage as string }}
          style={{
            width: cardWidth,
            height: cardHeight,
            aspectRatio: isBackdrop ? 1.78 : undefined,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          contentFit="cover"
        />

        {movie.rating !== undefined && !isBackdrop && (
          <BlurView
            tint="dark"
            intensity={70}
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 50,
              flexDirection: 'row',
              alignItems: 'center',
              overflow: 'hidden',
              gap: 4,
            }}>
            <Star color="yellow" size={12} fill="yellow" />
            <Text className="!text-xs">{movie.rating.toFixed(1)}</Text>
          </BlurView>
        )}
      </View>

      <View className="gap-0.5 p-2.5">
        <Text numberOfLines={1} className="!text-md font-medium">
          {movie.title}
        </Text>

        {movie.releaseDate && (
          <Text numberOfLines={1} className="text-[13px] !text-neutral-400">
            {formatDate(movie.releaseDate)}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
