import { MovieDetailsProps } from '@/interfaces';
import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

export const MovieHeader = ({ movie }: { movie: MovieDetailsProps }) => {
  const { height } = useWindowDimensions();

  return (
    <View style={{ height: height * 0.55 }} className="relative items-center justify-center">
      <Image
        source={{ uri: movie?.poster_path }}
        style={StyleSheet.absoluteFillObject}
        contentPosition="top center"
        cachePolicy="memory-disk"
        blurRadius={20}
      />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      />

      <View className="items-center justify-center px-8">
        <View className="relative">
          <Image
            source={{ uri: movie?.poster_path }}
            style={{
              width: 240,
              height: 360,
              borderRadius: 20,
            }}
            cachePolicy="memory-disk"
            contentFit="cover"
          />
        </View>
      </View>
    </View>
  );
};
