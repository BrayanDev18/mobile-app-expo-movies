import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_SIZE = 44;

export const RowBack = ({ onPress = () => router.back() }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View style={{ top: top - 25 }} className="absolute z-20 p-4">
      <Pressable
        onPress={() => {
          onPress();
        }}
        className="items-center justify-center">
        <BlurView
          tint="light"
          intensity={40}
          experimentalBlurMethod="dimezisBlurView"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: 50,
            overflow: 'hidden',
          }}>
          <ChevronLeft color="white" size={28} />
        </BlurView>
      </Pressable>
    </View>
  );
};
