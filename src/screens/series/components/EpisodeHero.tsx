import { TmdbImage } from '@/components';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

// Stills are 16:9; the extra height leaves room for the floating back button.
export const EPISODE_HERO_HEIGHT = Math.round(width / 1.78) + 60;

export const EpisodeHero = ({ still, name }: { still: string | null; name: string }) => (
  <View style={{ height: EPISODE_HERO_HEIGHT }}>
    <TmdbImage
      path={still}
      size="w780"
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      accessibilityLabel={`${name} still`}
    />

    <LinearGradient
      colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.8)']}
      locations={[0, 0.35, 1]}
      style={StyleSheet.absoluteFill}
    />
  </View>
);
