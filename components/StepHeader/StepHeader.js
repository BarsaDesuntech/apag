import React from 'react';
import { Text, View } from 'react-native';
import { Circle } from './Circle';
import GlobalStyle from '../../style';

const MAX_NUMBER_LINES = 2;
export const StepHeader = ({ steps, currentStep }) => {
  return (
    <View style={{ width: '100%', flex: 1 }}>
      {steps.map((step, index) => (
        <View key={index} style={GlobalStyle.stepContainer}>
          <Circle selectedIndex={currentStep} index={++index} />
          <Text
            numberOfLines={MAX_NUMBER_LINES}
            ellipsizeMode="tail"
            style={GlobalStyle.titleCircle}>
            {step.title}
          </Text>
        </View>
      ))}
      <View style={GlobalStyle.line} />
    </View>
  );
};
