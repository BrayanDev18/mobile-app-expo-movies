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
    <Pressable style={{ width }} className={`relative px-2 ${className} gap-2`} onPress={onPress}>
      <BlurView
        intensity={50}
        tint="dark"
        style={{
          width,
          borderRadius: 12,
          overflow: 'hidden',
        }}>
        <View className="relative w-full">
          <Image
            source={{ uri: movieImage }}
            style={{ width, height, borderTopRightRadius: 10, borderTopLeftRadius: 10 }}
            cachePolicy="memory-disk"
            contentFit="cover"
          />

          <BlurView
            tint="dark"
            intensity={70}
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
              margin: 5,
              gap: 4,
            }}>
            <Star color="yellow" size={12} fill="yellow" />

            <Text className="!text-xs font-light">{rating}</Text>
          </BlurView>
        </View>

        <View className="gap-0.5 p-2">
          <Text numberOfLines={1} className="!text-md font-medium">
            {title}
          </Text>

          <Text numberOfLines={1} className="text-[14px] !text-neutral-400">
            {year}
          </Text>
        </View>
      </BlurView>
    </Pressable>
  );
};
