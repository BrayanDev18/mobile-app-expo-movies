import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { Text } from '@/components';

const TABS = [
  { key: 'home', label: 'Home', route: '/(root)/(tabs)/home' as const },
  { key: 'movies', label: 'Movies', route: '/(root)/movie/home' as const },
  { key: 'series', label: 'Series', route: '/(root)/series/home' as const },
];

interface HomePremiumTabsProps {
  top: number;
  activeTab?: string;
}

export const HomePremiumTabs = ({ top, activeTab = 'home' }: HomePremiumTabsProps) => {
  return (
    <View style={{ paddingTop: top + 15 }} className="flex-row gap-2.5 px-4 pb-4">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Pressable
            key={tab.key}
            onPress={() => router.replace(tab.route)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
            }}>
            <Text className="font-medium">{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
