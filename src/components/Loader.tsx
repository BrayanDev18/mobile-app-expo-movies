import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Screen } from './Screen';

const SIZE = 70;
const STROKE_WIDTH = 4;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ARC_LENGTH = CIRCUMFERENCE * 0.25;
const ROTATION_MS = 900;

// A fixed quarter arc that rotates: one compositor-only transform per frame, no
// SVG re-render and no visible seam at the loop point. Spinners keep spinning
// under Reduce Motion (like the native ones) because they signal progress.
export const Loader = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, {
        duration: ROTATION_MS,
        easing: Easing.linear,
        reduceMotion: ReduceMotion.Never,
      }),
      -1,
      false,
      undefined,
      ReduceMotion.Never
    );

    return () => cancelAnimation(rotation);
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value * 360}deg` }],
  }));

  return (
    <Screen>
      <View
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
        accessibilityLiveRegion="polite"
        className="h-full w-full items-center justify-center">
        <View style={{ width: SIZE, height: SIZE }}>
          <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
            <Circle
              stroke="#d3d3d3"
              fill="none"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
            />
          </Svg>

          <Animated.View style={[{ width: SIZE, height: SIZE }, spinStyle]}>
            <Svg width={SIZE} height={SIZE}>
              <Circle
                stroke="#FCBD11"
                fill="none"
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${ARC_LENGTH}, ${CIRCUMFERENCE}`}
                strokeLinecap="round"
              />
            </Svg>
          </Animated.View>
        </View>
      </View>
    </Screen>
  );
};
