import { MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabButtonProps {
  isFocused: boolean;
  label: string;
  iconName: string;
  onPress: () => void;
}

const HomeTabsLayout: React.FC = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTab {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#171717', borderTopColor: 'black' },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: () => <MaterialIcons name="home-filled" size={23} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: () => <MaterialIcons name="manage-search" size={23} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="myList"
        options={{
          title: 'My list',
          tabBarIcon: () => <MaterialIcons name="bookmark" size={23} color={'white'} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <MaterialIcons name="person-pin" size={23} color={'white'} />,
        }}
      />
    </Tabs>
  );
};

export default HomeTabsLayout;

const CustomTab: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();

  const iconMap: Record<string, string> = {
    home: 'home-filled',
    explore: 'manage-search',
    myList: 'bookmark',
    profile: 'person-pin',
  };

  return (
    <BlurView
      style={{ bottom }}
      intensity={80}
      experimentalBlurMethod="dimezisBlurView"
      tint="systemChromeMaterialDark"
      className="absolute bottom-0 left-0 right-0 mx-4 flex-row gap-4 overflow-hidden rounded-full bg-neutral-800 p-2">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;
        const iconName = iconMap[route.name];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabButton
            key={route.key}
            isFocused={isFocused}
            label={label}
            iconName={iconName}
            onPress={onPress}
          />
        );
      })}
    </BlurView>
  );
};

const TabButton: React.FC<TabButtonProps> = ({ isFocused, label, iconName, onPress }) => {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);
  const opacity = useSharedValue(0.5);
  const bg = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.95, { damping: 15, stiffness: 150 });
    iconScale.value = withSpring(isFocused ? 1.1 : 1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(isFocused ? 1 : 0.5, { duration: 200 });
    bg.value = withTiming(isFocused ? 1 : 0, { duration: 250 });
  }, [isFocused, bg, iconScale, opacity, scale]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(bg.value, [0, 1], ['transparent', '#404040']),
  }));

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handlePress = () => {
    scale.value = withSpring(0.88, { damping: 15, stiffness: 300 }, () => {
      scale.value = withSpring(isFocused ? 1 : 0.95);
    });
    onPress();
  };

  return (
    <Pressable onPress={handlePress} className="flex-1">
      <Animated.View
        style={animatedContainerStyle}
        className="items-center justify-center gap-1 rounded-full p-1">
        <Animated.View style={animatedIconStyle}>
          <MaterialIcons name={iconName as any} size={23} color={isFocused ? 'white' : '#a3a3a3'} />
        </Animated.View>

        <Animated.Text
          style={animatedTextStyle}
          className={`text-xs font-semibold ${isFocused ? 'text-white' : 'text-neutral-300'}`}>
          {label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};
