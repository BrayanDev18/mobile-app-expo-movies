import { Icon, Text } from '@/components';
import { useLanguageStore } from '@/stores';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { SettingsRow } from './SettingsRow';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

const SPRING_CONFIG = { damping: 25, stiffness: 180 };

export const LanguageSelectorRow = ({ isLast = false }: { isLast?: boolean }) => {
  const { language, setLanguage } = useLanguageStore();
  const [expanded, setExpanded] = useState(false);

  const currentLabel =
    LANGUAGES.find((l) => l.code === language)?.label ?? 'English';

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: withSpring(expanded ? '180deg' : '0deg', SPRING_CONFIG) as any },
    ],
  }));

  const handleSelect = (code: string) => {
    if (code !== language) {
      Haptics.selectionAsync();
      setLanguage(code);
    }
    setExpanded(false);
  };

  return (
    <View
      style={
        !isLast && !expanded
          ? { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }
          : undefined
      }>
      <SettingsRow
        icon="Globe"
        iconColor="#22C55E"
        label="Language"
        isLast
        accessibilityLabel={`Language, currently ${currentLabel}`}
        onPress={() => setExpanded((v) => !v)}
        rightElement={
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm !text-neutral-400">{currentLabel}</Text>
            <Animated.View style={chevronStyle}>
              <Icon name="ChevronDown" size={16} color="rgba(255,255,255,0.4)" />
            </Animated.View>
          </View>
        }
      />

      {expanded && (
        <View
          style={[
            { paddingHorizontal: 16, paddingBottom: 12 },
            !isLast && {
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(255,255,255,0.06)',
            },
          ]}>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <Pressable
                key={lang.code}
                onPress={() => handleSelect(lang.code)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={lang.label}
                className="flex-row items-center gap-3 rounded-xl px-3 py-3"
                style={
                  isSelected
                    ? { backgroundColor: 'rgba(34,197,94,0.08)' }
                    : undefined
                }>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isSelected ? '#22C55E' : 'rgba(255,255,255,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {isSelected && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: '#22C55E',
                      }}
                    />
                  )}
                </View>
                <Text
                  className="text-sm font-medium"
                  style={{ color: isSelected ? '#22C55E' : 'rgba(255,255,255,0.6)' }}>
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};
