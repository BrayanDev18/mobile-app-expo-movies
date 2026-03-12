import { Text } from '@/components';
import { Children, cloneElement, isValidElement, ReactElement } from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
  enterDelay?: number;
}

export const SettingsSection = ({
  title,
  children,
  enterDelay = 0,
}: SettingsSectionProps) => {
  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <Animated.View
      entering={FadeInDown.delay(enterDelay).springify().damping(30).stiffness(200)}
      className="gap-3">
      {title && (
        <Text className="!text-lg font-bold px-1">{title}</Text>
      )}

      <View
        className="overflow-hidden rounded-2xl"
        style={{
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(38,38,38,0.5)',
        }}>
        {childArray.map((child, index) =>
          cloneElement(child as ReactElement<any>, {
            isLast: index === childArray.length - 1,
          })
        )}
      </View>
    </Animated.View>
  );
};
