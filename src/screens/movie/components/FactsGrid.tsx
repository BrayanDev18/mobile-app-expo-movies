import { SectionTitle, Text } from '@/components';
import { View } from 'react-native';

export interface FactItem {
  label: string;
  value?: string | number | null;
}

export const FactsGrid = ({ facts }: { facts: FactItem[] }) => {
  const visibleFacts = facts.filter((fact) => fact.value);

  if (!visibleFacts.length) return null;

  return (
    <View className="gap-3">
      <SectionTitle title="Details" />

      <View className="flex-row flex-wrap">
        {visibleFacts.map((fact) => (
          <View key={fact.label} style={{ width: '50%' }} className="gap-0.5 pb-4 pr-4">
            <Text className="!text-neutral-400">{fact.label}</Text>

            <Text className="!text-md font-medium">{fact.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
