import * as LucideIcons from 'lucide-react-native';
import { Pressable, ViewStyle } from 'react-native';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Icon = (props: IconProps) => {
  const { name, size = 24, color, strokeWidth = 2, className, onPress, style } = props;

  const LucideIcon = LucideIcons[name] as React.ComponentType<any>;

  return (
    <Pressable className={className} onPress={onPress}>
      <LucideIcon
        size={size}
        color={color ? color : 'white'}
        strokeWidth={strokeWidth}
        style={style}
      />
    </Pressable>
  );
};
