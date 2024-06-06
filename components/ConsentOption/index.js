import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Switch, Text } from 'react-native-paper';
import { black, fontScale, primaryBlue, primaryGreen } from '../../style';
import { Portal } from 'react-native-paper';

export const ConsentOption = ({
  label,
  labelSuffix,
  value,
  DetailComponent,
  id,
  changeSettings,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleChange = (updatedValue = !value) =>
    changeSettings(id, updatedValue);

  return (
    <>
      <View style={ConsentStyle.ConsentContainer}>
        <Text
          variant="labelLarge"
          style={[ConsentStyle.ConsentTextContainer, ConsentStyle.ConsentText]}>
          {label + ' '}
          <Text
            variant="labelLarge"
            style={[ConsentStyle.ConsentText, ConsentStyle.ConsentTextBold]}
            onPress={() => setShowDetail(true)}>
            {labelSuffix}
          </Text>
        </Text>
        <Switch
          color={primaryGreen}
          value={value}
          onValueChange={handleChange}
        />
      </View>
      <Divider />
      {showDetail && (
        <Portal>
          <DetailComponent
            onClose={() => setShowDetail(false)}
            onAction={handleChange}
          />
        </Portal>
      )}
    </>
  );
};

const ConsentStyle = StyleSheet.create({
  ConsentContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ConsentTextContainer: {
    flexWrap: 'wrap',
    width: '80%',
  },
  ConsentText: {
    color: black,
    fontSize: 16 * fontScale,
  },
  ConsentTextBold: {
    color: primaryBlue,
    fontWeight: 'bold',
  },
});
