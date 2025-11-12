import { MaterialIcons } from '@expo/vector-icons';
import {
  BottomTabNavigationEventMap,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { NavigationHelpers, ParamListBase, TabNavigationState } from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { Navigator } = createBottomTabNavigator();
export const BottomTabs = withLayoutContext(Navigator);

interface CustomTabBarProps {
  state: TabNavigationState<ParamListBase>;
  descriptors: Record<string, any>;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
}

type RouteNames = 'home' | 'explore' | 'myList' | 'profile';

interface TabItemProps {
  route: { name: string; key: string };
  index: number;
  isFocused: boolean;
  onPress: () => void;
  iconName: string;
}

const TabItem: React.FC<TabItemProps> = ({ isFocused, onPress, iconName }) => {
  const animatedValue = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isFocused ? 1 : 0,
      useNativeDriver: true,
      damping: 13,
      stiffness: 120,
    }).start();
  }, [isFocused]);

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
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View className="h-14 w-14 items-center justify-center rounded-lg">
          <Animated.View className="absolute inset-0 rounded-xl bg-cyan-800" style={{ opacity }} />

          <MaterialIcons name={iconName as any} size={28} color={'white'} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, navigation }) => {
  const { bottom } = useSafeAreaInsets();

  const iconsName: Record<string, any> = {
    home: 'home-filled',
    explore: 'manage-search',
    myList: 'bookmark',
    profile: 'person-pin',
  };

  return (
    <View
      style={{
        paddingBottom: bottom,
      }}
      className="absolute bottom-0 left-0 right-0 z-50 flex-row items-center justify-center gap-10 rounded-t-2xl bg-neutral-900 py-5 shadow-sm">
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const iconName = iconsName[route.name as RouteNames];

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
            iconName={iconName}
          />
        );
      })}
    </View>
  );
};

const HomeTabsLayout: React.FC = () => {
  return (
    <BottomTabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#171717' },
        tabBarStyle: { display: 'none' },
        animation: 'shift',
      }}>
      <BottomTabs.Screen name="home" options={{ title: 'Home' }} />

      <BottomTabs.Screen name="explore" options={{ title: 'Explore' }} />

      <BottomTabs.Screen name="myList" options={{ title: 'My list' }} />

      <BottomTabs.Screen name="profile" options={{ title: 'Profile' }} />
    </BottomTabs>
  );
};

export default HomeTabsLayout;
