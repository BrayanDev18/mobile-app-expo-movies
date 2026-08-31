import { tmdbImage } from '@/utils';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';

const SCRIM_COLORS = ['rgba(0,0,0,0.45)', 'rgba(0,0,0,0.85)', 'rgba(6,6,6,0.98)'] as const;

// Full-screen blurred poster + scrim used behind tab screens. The scrim always
// renders so a screen without a backdrop still gets a consistent ground.
export const BlurredBackdrop = ({ path }: { path?: string | null }) => (
  <>
    {path ? (
      <Image
        source={{ uri: tmdbImage(path, 'w185') ?? undefined }}
        blurRadius={50}
        style={StyleSheet.absoluteFill}
      />
    ) : null}

    <LinearGradient
      colors={[...SCRIM_COLORS]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  </>
);
