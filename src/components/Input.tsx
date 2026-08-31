import { cn } from '@/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { Pressable, TextInput, TextInputProps, View } from 'react-native';
import { Icon, IconName } from './Icon';
import { Text } from './Text';

interface InputProps<T extends FieldValues> extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  name: Path<T>;
  control: Control<T>;
  iconName?: IconName;
  required?: boolean;
}

export const Input = <T extends FieldValues>({
  label,
  error,
  isPassword = false,
  className,
  name,
  control,
  required = false,
  iconName,
  ...props
}: InputProps<T>) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      rules={required ? { required: { value: true, message: 'Required field' } } : {}}
      render={({ field: { onChange, onBlur, value }, fieldState }) => {
        const errorMessage = fieldState.error?.message ?? error;

        return (
          <View className="gap-1.5">
            {label ? (
              <Text className="text-base font-semibold text-neutral-400">{label}</Text>
            ) : null}

            <View
              className={cn(
                className,
                `flex-row items-center gap-3 rounded-2xl border-2 bg-neutral-800 px-4 ${
                  errorMessage ? 'border-red-400' : isFocused ? 'border-blue-500' : 'border-transparent'
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
                accessibilityLabel={label ?? props.placeholder}
                secureTextEntry={isPassword && !showPassword}
                className="h-12 flex-1 font-satoshi text-neutral-200"
                placeholderTextColor="#9ca3af"
              />

              {isPassword && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={8}
                  onPress={() => setShowPassword(!showPassword)}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#9ca3af"
                  />
                </Pressable>
              )}
            </View>

            {errorMessage ? (
              <Text accessibilityLiveRegion="polite" className="!text-[12px] !text-red-400">
                {errorMessage}
              </Text>
            ) : null}
          </View>
        );
      }}
    />
  );
};
