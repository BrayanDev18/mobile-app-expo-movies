import { Text } from '@/components';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { Star } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

interface MovieCardProps {
  id: number;
  movieImage: string;
  width: number;
  onPress?: () => void;
  height: number;
  rating?: number;
  className?: string;
  title: string;
  year?: string;
}

export const MovieCard = (props: MovieCardProps) => {
  const { movieImage, width, rating, title, onPress, height, className, year } = props;

  return (
    <Pressable
      style={{ width: width * 1 }}
      className={`relative px-2 active:opacity-90 ${className} gap-2`}
      onPress={onPress}>
      <View className="relative">
        <Image
          source={{ uri: movieImage }}
          className="flex-1 rounded-md shadow-lg"
          style={{ width, height, borderRadius: 10 }}
          cachePolicy="memory-disk"
          contentFit="cover"
        />

        <BlurView
          tint="dark"
          intensity={60}
          style={{
            position: 'absolute',
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 50,
            overflow: 'hidden',
            alignContent: 'flex-end',
            alignSelf: 'flex-end',
            flexDirection: 'row',
            alignItems: 'center',
            margin: 4,
            gap: 4,
          }}>
          <Star color="yellow" size={12} fill="yellow" />

          <Text className="!text-xs font-light">{rating}</Text>
        </BlurView>
      </View>

      <View className="gap-0.5">
        <Text numberOfLines={1} className="!text-md font-medium">
          {title}
        </Text>

        <Text numberOfLines={1} className="!text-neutral-400">
          {year}
        </Text>
      </View>
    </Pressable>
  );
};
