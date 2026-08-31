import React, { useState } from 'react';
import {
  NativeSyntheticEvent,
  TextLayoutEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from './Text';

interface ExpandableTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  textClassname?: string;
}

export const ExpandableText = (props: ExpandableTextProps) => {
  const { children, numberOfLines = 2, textClassname = '' } = props;

  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [measured, setMeasured] = useState(false);

  // Reset measurement state when the content changes — adjusted during render
  // (the React-sanctioned pattern) instead of a cascading effect.
  const [prevChildren, setPrevChildren] = useState(children);

  if (prevChildren !== children) {
    setPrevChildren(children);
    setExpanded(false);
    setShowToggle(false);
    setMeasured(false);
  }

  const onMeasure = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    setShowToggle(event.nativeEvent.lines.length > numberOfLines);
    setMeasured(true);
  };

  return (
    <View className="w-full">
      {!measured && (
        <Text
          className={textClassname}
          style={{ position: 'absolute', opacity: 0, width: '100%' }}
          onTextLayout={onMeasure}>
          {children}
        </Text>
      )}

      <Text numberOfLines={expanded ? undefined : numberOfLines} className={textClassname}>
        {children}
      </Text>

      {showToggle && (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Show less' : 'Show more'}
          accessibilityState={{ expanded }}
          hitSlop={8}
          onPress={() => setExpanded((prev) => !prev)}
          className="self-end">
          <Text className="font-semibold !text-blue-500">
            {expanded ? 'Show less' : 'Show more'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
