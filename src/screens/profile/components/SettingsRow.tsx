import { Icon, Text } from '@/components';
import { Pressable, View } from 'react-native';

interface SettingsRowProps {
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  label: string;
  description?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isLast?: boolean;
  accessibilityLabel: string;
  destructive?: boolean;
}

export const SettingsRow = ({
  icon,
  iconColor = '#3B82F6',
  iconBgColor,
  label,
  description,
  rightElement,
  onPress,
  isLast = false,
  accessibilityLabel,
  destructive = false,
}: SettingsRowProps) => {
  const bgColor = iconBgColor ?? `${iconColor}1A`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="flex-row items-center px-4 py-3"
      style={[
        { minHeight: 52 },
        !isLast && {
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.06)',
        },
      ]}>
      <View
        className="items-center justify-center rounded-xl"
        style={{
          width: 36,
          height: 36,
          backgroundColor: bgColor,
        }}>
        <Icon name={icon as any} size={18} color={iconColor} />
      </View>

      <View className="ml-3 flex-1 gap-0.5">
        <Text
          className="!text-md font-medium"
          style={destructive ? { color: '#EF4444' } : undefined}>
          {label}
        </Text>
        {description && (
          <Text className="text-xs !text-neutral-400">{description}</Text>
        )}
      </View>

      {rightElement && <View className="ml-2">{rightElement}</View>}
    </Pressable>
  );
};
