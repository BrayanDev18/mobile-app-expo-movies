import { FlashList as ShopifyFlashList, FlashListProps } from '@shopify/flash-list';
import { useCssElement } from 'nativewind';
import { ComponentType, ReactElement } from 'react';

const cssElement = useCssElement as (
  component: ComponentType<any>,
  props: object,
  mapping: Record<string, string>
) => ReactElement;

export const FlashList = <T,>(
  props: FlashListProps<T> & { className?: string; contentContainerClassName?: string }
) =>
  cssElement(ShopifyFlashList, props, {
    className: 'style',
    contentContainerClassName: 'contentContainerStyle',
  });
