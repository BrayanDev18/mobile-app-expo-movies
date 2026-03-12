import React, { createContext, ReactNode, useContext, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text } from './Text';

type TabsContextProps = {
  active: string;
  setActive: (value: string) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

export const CustomTabs = ({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: ReactNode;
}) => {
  const [active, setActive] = useState(defaultValue);

  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
};

const useTabs = () => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tabs.* must be inside <Tabs>');
  return ctx;
};

export const TabsList = ({ children }: { children: ReactNode }) => (
  <Animated.View
    entering={FadeInDown.delay(100).springify()}
    className="flex-row gap-2 rounded-full bg-neutral-800/50 p-1.5">
    {children}
  </Animated.View>
);

export const TabsTrigger = ({ value, children }: { value: string; children: ReactNode }) => {
  const { active, setActive } = useTabs();

  const isActive = active === value;

  return (
    <TouchableOpacity
      className={`flex-1 items-center rounded-full px-4 py-3 ${
        isActive ? 'bg-neutral-700' : 'bg-transparent'
      }`}
      onPress={() => setActive(value)}>
      <Text className={`font-semibold ${isActive ? 'text-white' : 'text-neutral-400'}`}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export const TabsPanel = ({ value, children }: { value: string; children: ReactNode }) => {
  const { active } = useTabs();
  if (active !== value) return null;

  return <>{children}</>;
};
