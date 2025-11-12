import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { translate } from '../translate';
import { cn } from '../utils';

interface TextProps extends RNTextProps {
  tx?: string;
  txOptions?: Record<string, any>;
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
  const i18nText = tx ? translate(tx, txOptions) : '';
  const content = text || i18nText || children;

  return (
    <RNText {...rest} style={$styleOverride} className={cn(className, 'text-sm text-white')}>
      {content}
    </RNText>
  );
}
