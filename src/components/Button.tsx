import { cn } from '@/utils';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef } from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { Text } from './Text';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(
  ({ title, disabled, ...touchableProps }, ref) => {
    return (
      <LinearGradient
        colors={['#68BEF1', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 48, width: '100%', borderRadius: 50, opacity: disabled ? 0.5 : 1 }}>
        <TouchableOpacity
          ref={ref}
          accessibilityRole="button"
          accessibilityLabel={title}
          accessibilityState={{ disabled: !!disabled }}
          disabled={disabled}
          {...touchableProps}
          className={cn(styles.button, touchableProps.className)}>
          <Text className={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
);

const styles = {
  button: 'items-center rounded-[28px] p-4',
  buttonText: 'text-md text-center font-medium',
};
