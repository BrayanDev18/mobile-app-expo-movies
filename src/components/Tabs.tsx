import { cn } from '@/utils';
import { memo } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';

interface TabsProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  className?: string;
  adaptableWidth?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Tab = memo((props: TabsProps) => {
  const { title, isActive, onPress, className, adaptableWidth } = props;

  const progress = useDerivedValue(() => {
    return withSpring(isActive ? 1 : 0, {
      damping: 30,
      stiffness: 200,
    });
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
      className={cn(
        className,
        adaptableWidth ? 'px-5' : 'flex-1',
        'h-10 items-center justify-center rounded-full px-4'
      )}>
      <Animated.Text style={textStyle} className="text-base font-medium">
        {title}
      </Animated.Text>
    </AnimatedPressable>
  );
});
