import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { TxKeyPath, useTranslate } from '../translate';
import { cn } from '../utils';

interface TextProps extends RNTextProps {
  /** Translation key — re-renders when the app language changes. */
  tx?: TxKeyPath;
  txOptions?: Record<string, unknown>;
  text?: string;
  style?: RNTextProps['style'];
  className?: string;
  children?: React.ReactNode;
}

export function Text({
  tx,
  txOptions,
  text,
  children,
  style: $styleOverride,
  className = '',
  ...rest
}: TextProps) {
  const { t } = useTranslate();
  const i18nText = tx ? t(tx, txOptions) : undefined;
  const content = text ?? i18nText ?? children;

  return (
    <RNText
      {...rest}
      style={$styleOverride}
      // Defaults first so a caller's className wins without needing `!`
      className={cn('font-satoshi text-sm text-white', className)}>
      {content}
    </RNText>
  );
}
