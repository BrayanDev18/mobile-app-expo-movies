import { ReactNode } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const HERO_WIDTH = width * 0.6;
const HERO_HEIGHT = HERO_WIDTH * 1.5;

// Static placeholders on purpose — continuous pulse animations run per-frame
// and overheat devices, so skeletons stay still.
const SkeletonBox = ({ style }: { style: ViewStyle }) => (
  <View className="bg-white/10" style={style} />
);

export const HomeSkeleton = ({ header }: { header?: ReactNode }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-900" style={header ? undefined : { paddingTop: top + 15 }}>
      {header ?? (
        <View className="flex-row gap-2 px-4 pb-6">
          <SkeletonBox style={{ width: 84, height: 40, borderRadius: 999 }} />
          <SkeletonBox style={{ width: 84, height: 40, borderRadius: 999 }} />
        </View>
      )}

      <View className="items-center pb-8">
        <SkeletonBox style={{ width: HERO_WIDTH, height: HERO_HEIGHT, borderRadius: 22 }} />
      </View>

      <View className="gap-3 px-4">
        <SkeletonBox style={{ width: 160, height: 18, borderRadius: 6 }} />

        <View className="flex-row gap-3">
          <SkeletonBox style={{ width: 150, height: 220, borderRadius: 12 }} />
          <SkeletonBox style={{ width: 150, height: 220, borderRadius: 12 }} />
          <SkeletonBox style={{ width: 150, height: 220, borderRadius: 12 }} />
        </View>
      </View>
    </View>
  );
};
