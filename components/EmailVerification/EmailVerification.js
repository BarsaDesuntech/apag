import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export const EmailVerification = ({ forwardStep }) => {
  return (
    <View>
      <Text>Test</Text>
      <Button mode="contained" onPress={forwardStep}>
        Hit
      </Button>
    </View>
  );
};
