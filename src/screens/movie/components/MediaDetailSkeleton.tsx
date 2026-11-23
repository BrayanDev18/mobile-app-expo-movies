import { View, ViewStyle } from 'react-native';

// Static on purpose — looping pulses run per-frame and overheat devices.
const SkeletonBox = ({ style }: { style: ViewStyle }) => (
  <View className="bg-white/10" style={style} />
);

// Body placeholder shown inside MediaDetailShell while a detail payload loads,
// sized like MediaInfoShell so the content doesn't jump when it arrives.
export const MediaDetailSkeleton = () => (
  <View className="gap-8" accessibilityRole="progressbar" accessibilityLabel="Loading details">
    <View className="gap-4">
      <SkeletonBox style={{ width: '70%', height: 28, borderRadius: 8 }} />
      <SkeletonBox style={{ width: '50%', height: 16, borderRadius: 6 }} />

      <View className="flex-row gap-2">
        <SkeletonBox style={{ width: 70, height: 26, borderRadius: 999 }} />
        <SkeletonBox style={{ width: 90, height: 26, borderRadius: 999 }} />
        <SkeletonBox style={{ width: 80, height: 26, borderRadius: 999 }} />
      </View>
    </View>

    <View className="gap-2">
      <SkeletonBox style={{ width: 110, height: 18, borderRadius: 6 }} />
      <SkeletonBox style={{ width: '100%', height: 14, borderRadius: 6 }} />
      <SkeletonBox style={{ width: '100%', height: 14, borderRadius: 6 }} />
      <SkeletonBox style={{ width: '60%', height: 14, borderRadius: 6 }} />
    </View>
  </View>
);
