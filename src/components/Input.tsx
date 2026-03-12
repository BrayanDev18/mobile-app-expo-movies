import { cn } from '@/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Icon } from './Icon';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  name: any;
  control?: Control<any>;
  iconName?: any;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  className,
  name,
  control,
  required = false,
  iconName,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: { value: true, message: 'Required field' } } : {}}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className="gap-1.5">
          {label ? <Text className="text-base font-semibold text-neutral-400">{label}</Text> : null}

          <View
            className={cn(
              className,
              `flex-row items-center gap-3 rounded-2xl border-2 bg-neutral-800 px-4 ${
                error ? 'border-red-400' : isFocused ? 'border-cyan-600' : 'border-transparent'
              }`
            )}>
            {iconName ? <Icon name={iconName} color="gray" size={20} /> : null}

            <TextInput
              {...props}
              value={value}
              onChangeText={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              secureTextEntry={isPassword && !showPassword}
              className="h-12 flex-1 text-neutral-200"
              placeholderTextColor="#9ca3af"
            />

            {isPassword && (
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#9ca3af"
                />
              </Pressable>
            )}
          </View>
        </View>
      )}
    />
  );
};
