import { FloatingTabBar } from '@/components';
import { Tabs } from 'expo-router';
import React from 'react';

const HomeTabsLayout: React.FC = () => {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#171717' },
      }}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
      <Tabs.Screen name="myList" options={{ title: 'My list' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
};

export default HomeTabsLayout;
