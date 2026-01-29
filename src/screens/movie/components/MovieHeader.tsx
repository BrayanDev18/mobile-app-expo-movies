import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';

const { height: heightScreen } = Dimensions.get('screen');

export const MovieHeader = ({ poster }: { poster: string }) => (
  <View style={{ height: heightScreen * 0.53 }} className="relative items-center justify-center">
    <Image
      source={{ uri: poster }}
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
        source={{ uri: poster }}
        style={{ width: '100%', height: '100%' }}
        cachePolicy="memory-disk"
        contentFit="fill"
      />
    </View>
  </View>
);
