import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from './Text';

interface ExpandableTextProps {
  children: React.ReactNode;
  numberOfLines?: number;
  textClassname?: string;
}

export const ExpandableText = (props: ExpandableTextProps) => {
  const { children, numberOfLines = 2, textClassname = '' } = props;

  const [expanded, setExpanded] = useState(false);
  const [height, setHeight] = useState(0);

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    setHeight(expanded ? 0 : 1);
  };

  return (
    <View className="w-full">
      <View
        style={{
          height: height === 0 ? undefined : 'auto',
          overflow: 'hidden',
        }}>
        <Text numberOfLines={expanded ? undefined : numberOfLines} className={textClassname}>
          {children}
        </Text>
      </View>

      <TouchableOpacity onPress={toggleExpand} className="self-end">
        <Text className="font-semibold !text-blue-500" tx={expanded ? 'Show less' : 'Show more'} />
      </TouchableOpacity>
    </View>
  );
};
