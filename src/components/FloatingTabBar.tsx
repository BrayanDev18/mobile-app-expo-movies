import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { ImageSourcePropType, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';

type BottomTabBarProps = Parameters<
  NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>
>[0];

const TAB_ICONS: Record<string, ImageSourcePropType> = {
  home: require('@/assets/icons/tabs/home.png'),
  explore: require('@/assets/icons/tabs/explore.png'),
  myList: require('@/assets/icons/tabs/list.png'),
  profile: require('@/assets/icons/tabs/profile.png'),
};

export const FloatingTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: bottom + 96 }}>
        {Platform.OS === 'ios' ? (
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.8)', '#000']}
                locations={[0, 0.35, 0.7, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            }>
            <BlurView tint="dark" intensity={25} style={StyleSheet.absoluteFill} />
          </MaskedView>
        ) : (
          <LinearGradient
            colors={['transparent', 'rgba(6,6,6,0.25)', 'rgba(6,6,6,0.55)']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
      </View>

      <View
        pointerEvents="box-none"
        style={{ position: 'absolute', left: 20, right: 20, bottom: bottom - 5 }}>
        <BlurView
          tint="dark"
          intensity={50}
          style={{ borderRadius: 999, overflow: 'hidden' }}>
          <View
            className="flex-row items-center p-2 h-[60]"
            style={{
              backgroundColor: 'rgba(6,6,6,0.40)',
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.03)',
            }}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;
              const { options } = descriptors[route.key];
              const label = options.title ?? route.name;

              const onPress = () => {
                Haptics.selectionAsync();

                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              };

              return (
                <Animated.View
                  key={route.key}
                  layout={LinearTransition.springify().damping(40).stiffness(150)}
                  style={{ flex: isFocused ? 2 : 1 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                    onPress={onPress}
                    className="relative h-[42] flex-row items-center justify-center gap-1.5 overflow-hidden rounded-full">
                    {isFocused && (
                      <Animated.View
                        entering={FadeIn.duration(100)}
                        className="bg-neutral-800"
                        style={[
                          StyleSheet.absoluteFill,
                          { borderRadius: 999 },
                        ]}
                      />
                    )}

                    <Image
                      source={TAB_ICONS[route.name]}
                      style={{ width: 24, height: 24 }}
                      contentFit="contain"
                      tintColor={isFocused ? '#FFFFFF' : '#9CA3AF'}
                      accessibilityLabel={`${label} tab icon`}
                    />

                    {isFocused && (
                      <Animated.View entering={FadeIn.duration(300)}>
                        <Text numberOfLines={1} className="!text-[13px] font-semibold">
                          {label}
                        </Text>
                      </Animated.View>
                    )}
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        </BlurView>
      </View>
    </>
  );
};
