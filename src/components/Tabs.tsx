import { EASE_OUT } from '@/constants';
import { cn } from '@/utils';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

interface TabsProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  className?: string;
  adaptableWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Tab = (props: TabsProps) => {
  const { title, isActive, onPress, className, adaptableWidth } = props;

  // Discrete state change, no finger momentum — timing, not a spring.
  const progress = useDerivedValue(() => {
    return withTiming(isActive ? 1 : 0, { duration: 180, easing: EASE_OUT });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0)', 'rgba(59, 130, 246, 0.15)']
    );
    return { backgroundColor };
  });

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['rgb(163, 163, 163)', 'rgb(59, 130, 246)']),
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={title}
      accessibilityState={{ selected: isActive }}
      className={cn(
        className,
        adaptableWidth ? 'px-5' : 'flex-1',
        'h-10 items-center justify-center rounded-full px-4'
      )}>
      <Animated.Text style={textStyle} className="font-satoshi text-base font-medium">
        {title}
      </Animated.Text>
    </AnimatedPressable>
  );
};
