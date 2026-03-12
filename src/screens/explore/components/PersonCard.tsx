import { Icon, Text } from '@/components';
import { PersonProps } from '@/interfaces';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

interface PersonCardProps {
  person: PersonProps;
}

export const PersonCard = ({ person }: PersonCardProps) => (
  <Pressable
    onPress={() =>
      router.push({ pathname: '/(root)/movie/cast/[id]', params: { id: person.id } })
    }
    accessibilityRole="button"
    accessibilityLabel={`${person.name}, ${person.department}`}
    className="items-center gap-2"
    style={{ width: 110 }}>
    {person.avatar ? (
      <Image
        source={{ uri: person.avatar }}
        style={{ width: 90, height: 90, borderRadius: 45 }}
        contentFit="cover"
        cachePolicy="memory-disk"
      />
    ) : (
      <View
        className="items-center justify-center bg-neutral-800"
        style={{ width: 90, height: 90, borderRadius: 45 }}>
        <Icon name="User" size={32} color="rgba(255,255,255,0.2)" />
      </View>
    )}

    <View className="items-center gap-0.5">
      <Text className="text-xs font-medium" numberOfLines={1} style={{ textAlign: 'center' }}>
        {person.name}
      </Text>
      <Text className="text-xs !text-neutral-500" numberOfLines={1}>
        {person.department}
      </Text>
    </View>
  </Pressable>
);
