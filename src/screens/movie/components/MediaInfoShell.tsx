import { ExpandableText, RatingBadge, SectionTitle, Text } from '@/components';
import { GenreProps } from '@/interfaces';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';

export const InfoMetaItem = ({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
}) => (
  <View className="flex-row items-center gap-1">
    <Ionicons name={icon} size={15} color="rgba(255,255,255,0.6)" />

    <Text className="text-sm font-medium text-white/60">{children}</Text>
  </View>
);

interface MediaInfoShellProps {
  title: string;
  homepage?: string | null;
  rating: number;
  metaItems: ReactNode;
  certification?: string | null;
  genres: GenreProps[];
  credit?: { label: string; names: string } | null;
  overview: string;
}

// Shared body of the movie and series info headers: title, homepage link,
// meta row, certification/genre chips, credit line, and the storyline.
export const MediaInfoShell = (props: MediaInfoShellProps) => {
  const { title, homepage, rating, metaItems, certification, genres, credit, overview } = props;

  return (
    <View className="gap-8">
      <View className="gap-4">
        <View className="gap-1">
          <Text numberOfLines={2} className="!text-2xl font-bold leading-tight">
            {title}
          </Text>

          {homepage ? (
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Open official website"
              hitSlop={8}
              className="flex-row items-center gap-1 self-start py-1"
              onPress={() => Linking.openURL(homepage)}>
              <Ionicons name="globe-outline" size={14} color="#60A5FA" />

              <Text className="!text-[13px] font-medium !text-blue-400">Official website</Text>
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row items-center gap-2">
          <RatingBadge value={rating} size="md" />

          {metaItems}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-2">
          {certification && (
            <View className="rounded-full bg-red-500/60 px-2 py-1">
              <Text className="text-xs font-semibold">{certification}</Text>
            </View>
          )}

          <View className="flex-row items-center gap-2">
            {genres?.map((genre, index) => (
              <View key={index} className="rounded-full bg-white/10 px-3 py-1">
                <Text className="font-medium text-white/80">{genre.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {credit?.names ? (
          <Text className="!text-[13px] !text-neutral-400">
            {credit.label}{' '}
            <Text className="!text-[13px] font-semibold !text-neutral-200">{credit.names}</Text>
          </Text>
        ) : null}
      </View>

      <View className="gap-2">
        <SectionTitle title="Storyline" />

        <ExpandableText numberOfLines={4} textClassname="!text-md leading-6 !text-neutral-400">
          {overview}
        </ExpandableText>
      </View>
    </View>
  );
};
