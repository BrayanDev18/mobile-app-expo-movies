import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef } from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

type ButtonProps = {
  title: string;
} & TouchableOpacityProps;

export const Button = forwardRef<View, ButtonProps>(({ title, ...touchableProps }, ref) => {
  return (
    <LinearGradient
      colors={['#68BEF1', '#2563EB']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ height: 48, width: '100%', borderRadius: 50 }}>
      <TouchableOpacity
        ref={ref}
        {...touchableProps}
        className={`${styles.button} ${touchableProps.className}`}>
        <Text className={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
});

const styles = {
  button: 'items-center rounded-[28px] p-4',
  buttonText: 'text-white text-md font-medium text-center',
};
