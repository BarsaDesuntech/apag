import { View } from 'react-native';
import React from 'react';
import { CustomActionSheet } from './ActionSheet';
import GlobalStyle, { primaryBlue } from '../style';

const WrapperAction = ({ back, children }) => {
  return (
    <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
      <CustomActionSheet handleBack={back}>{children}</CustomActionSheet>
    </View>
  );
};

export default WrapperAction;
