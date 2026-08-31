import { Text } from '@/components';
import { MovieProps, MyListFlag } from '@/interfaces';
import { useMyListStore } from '@/stores';
import * as Haptics from 'expo-haptics';
import { Bookmark, Eye, Heart, LucideIcon, Star } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';

const ACTIVE_COLOR = '#60A5FA';
const INACTIVE_COLOR = 'rgba(255,255,255,0.6)';
const RATING_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  fillWhenActive?: boolean;
  onPress: () => void;
}

const ActionButton = (props: ActionButtonProps) => {
  const { icon: ActionIcon, label, isActive, fillWhenActive, onPress } = props;
  const color = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
      className="min-h-[44px] flex-1 items-center justify-center gap-1.5 py-2">
      <ActionIcon
        size={20}
        color={color}
        fill={fillWhenActive && isActive ? ACTIVE_COLOR : 'transparent'}
      />

      <Text
        numberOfLines={1}
        className="!text-[11px] font-medium"
        style={{ color: isActive ? ACTIVE_COLOR : 'rgba(255,255,255,0.6)' }}>
        {label}
      </Text>
    </Pressable>
  );
};

interface RatingModalProps {
  visible: boolean;
  title: string;
  userRating: number | null;
  onRate: (rating: number | null) => void;
  onClose: () => void;
}

const RatingModal = ({ visible, title, userRating, onRate, onClose }: RatingModalProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onPress={onClose}>
      <Pressable
        className="w-full gap-5 rounded-3xl border p-6"
        style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: '#1f1f1f' }}
        onPress={(event) => event.stopPropagation()}>
        <View className="gap-1">
          <Text className="!text-lg font-bold">Your rating</Text>

          <Text numberOfLines={1} className="!text-[13px] !text-neutral-400">
            {title}
          </Text>
        </View>

        <View className="flex-row justify-between">
          {RATING_VALUES.map((value) => (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${value} out of 10`}
              hitSlop={6}
              onPress={() => {
                Haptics.selectionAsync();
                onRate(value);
              }}>
              <Star
                size={24}
                color={userRating && value <= userRating ? '#FACC15' : 'rgba(255,255,255,0.3)'}
                fill={userRating && value <= userRating ? '#FACC15' : 'transparent'}
              />
            </Pressable>
          ))}
        </View>

        {userRating !== null && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Remove rating"
            className="items-center rounded-full bg-white/10 py-2.5"
            onPress={() => {
              Haptics.selectionAsync();
              onRate(null);
            }}>
            <Text className="!text-[13px] font-medium !text-neutral-400">Remove rating</Text>
          </Pressable>
        )}
      </Pressable>
    </Pressable>
  </Modal>
);

export const MediaActionsBar = ({ movie }: { movie: MovieProps }) => {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const toggleFlag = useMyListStore((state) => state.toggleFlag);
  const setRating = useMyListStore((state) => state.setRating);
  const item = useMyListStore((state) =>
    state.items.find(
      (saved) => saved.id === movie.id && (saved.mediaType ?? 'movie') === (movie.mediaType ?? 'movie')
    )
  );

  const onToggle = (flag: MyListFlag) => {
    Haptics.selectionAsync();
    toggleFlag(movie, flag);
  };

  return (
    <>
      <View
        className="flex-row rounded-2xl border"
        style={{ borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.06)' }}>
        <ActionButton
          icon={Bookmark}
          label="Watchlist"
          isActive={!!item?.watchlist}
          fillWhenActive
          onPress={() => onToggle('watchlist')}
        />

        <ActionButton
          icon={Eye}
          label="Watched"
          isActive={!!item?.watched}
          onPress={() => onToggle('watched')}
        />

        <ActionButton
          icon={Heart}
          label="Favorite"
          isActive={!!item?.favorite}
          fillWhenActive
          onPress={() => onToggle('favorite')}
        />

        <ActionButton
          icon={Star}
          label={item?.userRating ? `${item.userRating}/10` : 'Rate'}
          isActive={!!item?.userRating}
          fillWhenActive
          onPress={() => setIsRatingOpen(true)}
        />
      </View>

      <RatingModal
        visible={isRatingOpen}
        title={movie.title}
        userRating={item?.userRating ?? null}
        onRate={(rating) => setRating(movie, rating)}
        onClose={() => setIsRatingOpen(false)}
      />
    </>
  );
};
