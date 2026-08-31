import { cn } from '@/utils';
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight, View } from 'react-native';
import { Text } from './Text';

interface SectionTitleProps {
  title: string;
  onSeeAll?: () => void;
  seeAllLabel?: string;
  className?: string;
}

export const SectionTitle = ({ title, onSeeAll, seeAllLabel, className }: SectionTitleProps) => (
  <View className="flex-row items-center justify-between">
    <Text accessibilityRole="header" className={cn('!text-lg font-bold', className)}>
      {title}
    </Text>

    {onSeeAll ? (
      <TouchableHighlight
        onPress={onSeeAll}
        underlayColor="#404040"
        accessibilityRole="button"
        accessibilityLabel={seeAllLabel ?? `See all ${title}`}
        className="h-12 w-12 items-center justify-center rounded-full">
        <Ionicons name="chevron-forward" color="rgba(255,255,255,0.6)" size={20} />
      </TouchableHighlight>
    ) : null}
  </View>
);
