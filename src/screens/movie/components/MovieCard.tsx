import { Text } from '@/components';
import { MovieProps } from '@/interfaces';
import { cn, formatDate, IMAGE_PLACEHOLDER } from '@/utils';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Star } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

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

  const cardWidth = width ?? (isBackdrop ? 300 : 150);
  const cardHeight = height ?? (isBackdrop ? undefined : 230);
  const movieImage = isBackdrop ? movie.backdrop : movie.poster;

  return (
    <Pressable
      style={{ width: cardWidth }}
      className={cn(className, 'relative')}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${movie.title}`}
      onPress={onPress}>
      <Image
        source={{ uri: movieImage as string }}
        style={{
          width: cardWidth,
          height: cardHeight,
          aspectRatio: isBackdrop ? 1.78 : undefined,
          borderRadius: 12,
        }}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={IMAGE_PLACEHOLDER}
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

      {isBackdrop && (
        <>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.85)']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
          />

          <View className="absolute bottom-0 w-full gap-0.5 p-3">
            <Text numberOfLines={1} className="!text-md font-semibold">
              {movie.title}
            </Text>

            {movie.releaseDate && (
              <Text numberOfLines={1} className="!text-[11px] !text-neutral-400">
                {formatDate(movie.releaseDate)}
              </Text>
            )}
          </View>
        </>
      )}
    </Pressable>
  );
};
