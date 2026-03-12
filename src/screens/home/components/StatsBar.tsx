import { Icon, Text } from '@/components';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatsBarProps {
  inTheaters: number;
  trending: number;
  upcoming: number;
}

export const StatsBar = ({ inTheaters, trending, upcoming }: StatsBarProps) => {
  if (!inTheaters && !trending && !upcoming) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(250).springify().damping(30).stiffness(200)}
      className="px-3">
      <View style={{ borderRadius: 20, overflow: 'hidden' }}>
        <BlurView intensity={40} tint="dark">
          <View
            className="flex-row items-center justify-around py-4"
            style={{ borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', borderRadius: 20 }}>
            <StatItem icon="Clapperboard" value={inTheaters} label="In Theaters" color="#3B82F6" />
            <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <StatItem icon="Flame" value={trending} label="Trending" color="#F97316" />
            <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <StatItem icon="Calendar" value={upcoming} label="Coming Soon" color="#A855F7" />
          </View>
        </BlurView>
      </View>
    </Animated.View>
  );
};

const StatItem = ({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: number;
  label: string;
  color: string;
}) => (
  <View className="items-center gap-1.5" accessibilityLabel={`${value} ${label}`}>
    <Icon name={icon as any} size={16} color={color} />
    <Text className="!text-lg font-bold">{value}</Text>
    <Text className="text-xs !text-neutral-400">{label}</Text>
  </View>
);
