import { FloatingTabBar } from '@/components';
import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslate } from '@/translate';

const HomeTabsLayout: React.FC = () => {
  const { t } = useTranslate();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: '#171717' },
      }}>
      <Tabs.Screen name="home" options={{ title: t('tabs.home') }} />
      <Tabs.Screen name="explore" options={{ title: t('tabs.explore') }} />
      <Tabs.Screen name="myList" options={{ title: t('tabs.myList') }} />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile') }} />
    </Tabs>
  );
};

export default HomeTabsLayout;
