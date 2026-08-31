import {
  Bell,
  Bookmark,
  BookmarkMinus,
  BookmarkX,
  Check,
  ChevronRight,
  Clapperboard,
  Compass,
  EyeOff,
  Film,
  HeartOff,
  History,
  Languages,
  ListX,
  MessageSquare,
  Moon,
  Pencil,
  Play,
  Search,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react-native';
import { Pressable, View, ViewStyle } from 'react-native';

// Explicit map so the bundler tree-shakes the rest of the lucide set and
// `name` is compile-checked instead of an unguarded namespace lookup.
const ICONS = {
  Bell,
  Bookmark,
  BookmarkMinus,
  BookmarkX,
  Check,
  ChevronRight,
  Clapperboard,
  Compass,
  EyeOff,
  Film,
  HeartOff,
  History,
  Languages,
  ListX,
  MessageSquare,
  Moon,
  Pencil,
  Play,
  Search,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  Users,
} as const;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  className?: string;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const Icon = (props: IconProps) => {
  const {
    name,
    size = 24,
    color,
    fill = 'transparent',
    strokeWidth = 2,
    className,
    onPress,
    style,
    accessibilityLabel,
  } = props;

  const LucideIcon = ICONS[name];

  if (!LucideIcon) return null;

  const icon = (
    <LucideIcon
      size={size}
      color={color ? color : 'white'}
      fill={fill}
      strokeWidth={strokeWidth}
      style={style}
    />
  );

  if (!onPress) return <View className={className}>{icon}</View>;

  return (
    <Pressable
      className={className}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}>
      {icon}
    </Pressable>
  );
};
