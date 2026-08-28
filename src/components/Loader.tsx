import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Screen } from './Screen';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 70;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Loader = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 2000, easing: Easing.linear }), -1);

    return () => cancelAnimation(progress);
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <Screen>
      <View className="h-full w-full items-center justify-center">
        <Svg width={SIZE} height={SIZE}>
          <Circle
            stroke="#d3d3d3"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
          />

          <AnimatedCircle
            animatedProps={animatedProps}
            stroke="#FCBD11"
            fill="none"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${CIRCUMFERENCE}, ${CIRCUMFERENCE}`}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </Screen>
  );
};
