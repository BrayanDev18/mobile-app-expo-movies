import * as Haptics from 'expo-haptics';
import { ScrollView, View } from 'react-native';
import { Tab } from './Tabs';

interface ChipRowProps<T extends string> {
  items: { key: T; label: string }[];
  active: T;
  onSelect: (key: T) => void;
  scrollable?: boolean;
  className?: string;
}

export const ChipRow = <T extends string>(props: ChipRowProps<T>) => {
  const { items, active, onSelect, scrollable, className = 'px-4' } = props;

  const chips = (
    <View className={`flex-row gap-2 ${className}`}>
      {items.map((item) => (
        <Tab
          key={item.key}
          title={item.label}
          isActive={active === item.key}
          adaptableWidth
          className="rounded-full border border-white/15"
          onPress={() => {
            if (item.key === active) return;

            Haptics.selectionAsync();
            onSelect(item.key);
          }}
        />
      ))}
    </View>
  );

  if (!scrollable) return chips;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="grow-0">
      {chips}
    </ScrollView>
  );
};
