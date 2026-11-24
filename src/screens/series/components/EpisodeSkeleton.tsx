import { View, ViewStyle } from 'react-native';
import { EPISODE_HERO_HEIGHT } from './EpisodeHero';

// Static on purpose — looping pulses run per-frame and overheat devices.
const SkeletonBox = ({ style }: { style: ViewStyle }) => (
  <View className="bg-white/10" style={style} />
);

export const EpisodeSkeleton = () => (
  <View
    className="flex-1 bg-neutral-900"
    accessibilityRole="progressbar"
    accessibilityLabel="Loading episode">
    <SkeletonBox style={{ height: EPISODE_HERO_HEIGHT }} />

    <View className="-mt-6 gap-8 rounded-t-3xl bg-neutral-900 px-4 pt-6">
      <View className="gap-3">
        <SkeletonBox style={{ width: 64, height: 22, borderRadius: 999 }} />
        <SkeletonBox style={{ width: '75%', height: 28, borderRadius: 8 }} />
        <SkeletonBox style={{ width: '55%', height: 16, borderRadius: 6 }} />
      </View>

      <View className="gap-2">
        <SkeletonBox style={{ width: 110, height: 18, borderRadius: 6 }} />
        <SkeletonBox style={{ width: '100%', height: 14, borderRadius: 6 }} />
        <SkeletonBox style={{ width: '100%', height: 14, borderRadius: 6 }} />
        <SkeletonBox style={{ width: '60%', height: 14, borderRadius: 6 }} />
      </View>

      <View className="gap-3">
        <SkeletonBox style={{ width: 130, height: 18, borderRadius: 6 }} />

        <View className="flex-row gap-4">
          {[0, 1, 2].map((key) => (
            <SkeletonBox key={key} style={{ width: 110, height: 110, borderRadius: 500 }} />
          ))}
        </View>
      </View>
    </View>
  </View>
);
