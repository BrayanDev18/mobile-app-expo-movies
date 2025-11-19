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

      <View
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          width: 230,
          height: 350,
        }}>
        <Image
          source={{ uri: movie?.poster_path }}
          style={{ width: '100%', height: '100%' }}
          cachePolicy="memory-disk"
          contentFit="fill"
        />
      </View>
    </View>
  );
};
