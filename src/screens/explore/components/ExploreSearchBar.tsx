import { Icon } from '@/components';
import { useRef } from 'react';
import { Pressable, TextInput, View } from 'react-native';

interface ExploreSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}

export const ExploreSearchBar = ({ value, onChangeText, onClear }: ExploreSearchBarProps) => {
  const inputRef = useRef<TextInput>(null);

  return (
    <View
      className="flex-row items-center gap-3 px-4"
      style={{
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginHorizontal: 16,
      }}>
      <Icon name="Search" size={18} color="rgba(255,255,255,0.4)" />

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search movies, series, people..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        returnKeyType="search"
        autoCorrect={false}
        autoCapitalize="none"
        className="h-12 flex-1 text-sm text-white"
      />

      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onClear();
            inputRef.current?.blur();
          }}
          className="h-8 w-8 items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          accessibilityRole="button"
          accessibilityLabel="Clear search">
          <Icon name="X" size={14} color="rgba(255,255,255,0.6)" />
        </Pressable>
      )}
    </View>
  );
};
