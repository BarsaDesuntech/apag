import React from 'react';
import { Text, View } from 'react-native';
import GlobalStyle from '../../style';

export const Circle = ({ index, selectedIndex }) => {
  return (
    <View
      style={
        index === selectedIndex
          ? { ...GlobalStyle.circle, backgroundColor: '#fff' }
          : { ...GlobalStyle.circle, backgroundColor: '#2E81D3' }
      }>
      <Text
        style={
          index === selectedIndex
            ? GlobalStyle.selectedcircleTitle
            : GlobalStyle.circleTitle
        }>
        {index}
      </Text>
    </View>
  );
};
