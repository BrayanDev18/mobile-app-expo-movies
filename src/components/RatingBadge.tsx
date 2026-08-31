import { Star } from 'lucide-react-native';
import { View } from 'react-native';
import { Text } from './Text';

const STAR_COLOR = '#FACC15';

const SIZES = {
  xs: { star: 11, text: '!text-[11px]' },
  sm: { star: 12, text: '!text-xs' },
  md: { star: 15, text: 'text-sm' },
} as const;

interface RatingBadgeProps {
  value: number;
  size?: keyof typeof SIZES;
  suffix?: string;
  precise?: boolean;
}

export const RatingBadge = ({ value, size = 'md', suffix, precise = true }: RatingBadgeProps) => {
  const { star, text } = SIZES[size];

  return (
    <View className="flex-row items-center gap-1">
      <Star color={STAR_COLOR} fill={STAR_COLOR} size={star} />

      <Text className={`${text} font-medium text-white/60`}>
        {precise ? value.toFixed(1) : value}
        {suffix ?? ''}
      </Text>
    </View>
  );
};
