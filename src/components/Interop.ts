import { FlashList as ShopifyFlashList, FlashListProps } from '@shopify/flash-list';
import { BlurView as ExpoBlurView, BlurViewProps } from 'expo-blur';
import { useCssElement } from 'nativewind';
import { ComponentType, ReactElement } from 'react';

const cssElement = useCssElement as (
  component: ComponentType<any>,
  props: object,
  mapping: Record<string, string>
) => ReactElement;

export const BlurView = (props: BlurViewProps & { className?: string }) =>
  cssElement(ExpoBlurView, props, { className: 'style' });

export const FlashList = <T,>(
  props: FlashListProps<T> & { className?: string; contentContainerClassName?: string }
) =>
  cssElement(ShopifyFlashList, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
