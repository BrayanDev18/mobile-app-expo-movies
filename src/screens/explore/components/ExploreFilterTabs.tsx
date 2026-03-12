import { Pressable, ScrollView } from 'react-native';
import { Text } from '@/components';

export type ExploreFilter = 'all' | 'movies' | 'series' | 'people';

interface ExploreFilterTabsProps {
  activeFilter: ExploreFilter;
  onFilterChange: (filter: ExploreFilter) => void;
}

const FILTERS: { key: ExploreFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'movies', label: 'Movies' },
  { key: 'series', label: 'Series' },
  { key: 'people', label: 'People' },
];

export const ExploreFilterTabs = ({ activeFilter, onFilterChange }: ExploreFilterTabsProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
      {FILTERS.map((filter) => {
        const isActive = filter.key === activeFilter;

        return (
          <Pressable
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={filter.label}
            style={{
              paddingHorizontal: 18,
              paddingVertical: 8,
              borderRadius: 50,
              borderWidth: 1,
              borderColor: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
              backgroundColor: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
            }}>
            <Text
              style={{
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
              }}
              className="text-sm font-medium">
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
};
