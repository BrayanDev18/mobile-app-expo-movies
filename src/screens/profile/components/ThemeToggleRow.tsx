import { useThemeStore } from '@/stores';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';

const SPRING_CONFIG = { damping: 30, stiffness: 200 };
const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_TRAVEL = TRACK_WIDTH - THUMB_SIZE - 6;

export const ThemeToggleRow = ({ isLast = false }: { isLast?: boolean }) => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  const handleToggle = () => {
    Haptics.selectionAsync();
    toggleTheme();
  };

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(isDark ? THUMB_TRAVEL : 0, SPRING_CONFIG),
      },
    ],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      isDark ? '#3B82F6' : 'rgba(255,255,255,0.15)',
      SPRING_CONFIG
    ) as any,
  }));

  return (
    <SettingsRow
      icon="Moon"
      iconColor="#8B5CF6"
      label="Dark Mode"
      isLast={isLast}
      accessibilityLabel={`Dark mode, currently ${isDark ? 'on' : 'off'}`}
      onPress={handleToggle}
      rightElement={
        <Pressable
          onPress={handleToggle}
          accessibilityRole="switch"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel="Toggle dark mode">
          <Animated.View
            style={[
              trackStyle,
              {
                width: TRACK_WIDTH,
                height: TRACK_HEIGHT,
                borderRadius: TRACK_HEIGHT / 2,
                justifyContent: 'center',
                paddingHorizontal: 3,
              },
            ]}>
            <Animated.View
              style={[
                thumbStyle,
                {
                  width: THUMB_SIZE,
                  height: THUMB_SIZE,
                  borderRadius: THUMB_SIZE / 2,
                  backgroundColor: 'white',
                },
              ]}
            />
          </Animated.View>
        </Pressable>
      }
    />
  );
};
