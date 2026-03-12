import { Icon } from '@/components';
import { Image } from 'expo-image';
import { Dimensions, StyleSheet, View } from 'react-native';

const { height: heightScreen } = Dimensions.get('screen');

interface EpisodeHeaderProps {
  stillPath: string | null;
}

export const EpisodeHeader = ({ stillPath }: EpisodeHeaderProps) => (
  <View
    style={{ height: heightScreen * 0.35 }}
    className="relative items-center justify-center">
    {stillPath ? (
      <Image
        source={{ uri: stillPath }}
        style={StyleSheet.absoluteFillObject}
        contentPosition="center"
        cachePolicy="memory-disk"
        blurRadius={20}
        accessibilityLabel="Episode background"
      />
    ) : null}

    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    />

    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        width: '85%',
        aspectRatio: 16 / 9,
      }}>
      {stillPath ? (
        <Image
          source={{ uri: stillPath }}
          style={{ width: '100%', height: '100%' }}
          cachePolicy="memory-disk"
          contentFit="cover"
          accessibilityLabel="Episode still"
        />
      ) : (
        <View className="h-full w-full items-center justify-center bg-neutral-800">
          <Icon name="Film" size={48} color="rgba(255,255,255,0.2)" />
        </View>
      )}
    </View>
  </View>
);
