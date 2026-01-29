import { MaterialIcons } from '@expo/vector-icons';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
} from '@react-navigation/material-top-tabs';
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { withLayoutContext } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createMaterialTopTabNavigator();
export const MaterialTopTabs = withLayoutContext(Navigator);

interface CustomTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: Record<string, any>;
  navigation: NavigationHelpers<ParamListBase, MaterialTopTabNavigationEventMap>;
}

type RouteNames = 'home' | 'explore' | 'myList' | 'profile';

interface TabItemProps {
  route: { name: string; key: string };
  index: number;
  isFocused: boolean;
  onPress: () => void;
  iconName: any;
  label: string;
}

const TabItem: React.FC<TabItemProps> = ({ isFocused, onPress, iconName, label }) => {
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      damping: 13,
      stiffness: 120,
    }).start();
  }, [isFocused, animatedValue]);

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale }],
      }}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="items-center justify-center p-2">
        <Animated.View
          className="absolute h-16 w-20 items-center justify-center rounded-2xl bg-[##404040]"
          style={{ opacity }}
        />
        <View className="w-20 items-center justify-center rounded-xl">
          <MaterialIcons name={iconName as any} size={26} color={isFocused ? 'white' : 'gray'} />

          <Animated.Text
            className={`text-xs font-semibold ${isFocused ? 'text-white' : 'text-neutral-400'}`}>
            {label}
          </Animated.Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();

  const icons: Record<RouteNames, any> = {
    home: 'home-filled',
    explore: 'manage-search',
    myList: 'bookmark',
    profile: 'person-pin',
  };

  return (
    <BlurView
      style={{ paddingBottom: bottom }}
      intensity={80}
      experimentalBlurMethod="dimezisBlurView"
      tint="systemChromeMaterialDark"
      className="absolute bottom-0 left-0 right-0 z-50 flex-row justify-center gap-4 overflow-hidden rounded-t-3xl bg-neutral-800 p-3">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const isFocused = state.index === index;
        const label = options.title || route.name;

        const iconName = icons[route.name as RouteNames];

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
          <TabItem
            key={route.key}
            route={route}
            index={index}
            isFocused={isFocused}
            onPress={onPress}
            label={label}
            iconName={iconName}
          />
        );
      })}
    </BlurView>
  );
};

const HomeTabsLayout: React.FC = () => {
  return (
    <MaterialTopTabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
      }}
      style={{ flex: 1 }}>
      <MaterialTopTabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <MaterialTopTabs.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />

      <MaterialTopTabs.Screen
        name="myList"
        options={{
          title: 'My list',
        }}
      />

      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </MaterialTopTabs>
  );
};

export default HomeTabsLayout;
