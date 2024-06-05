import { StyleSheet, View } from 'react-native';
import React from 'react';
import GlobalStyle, {
  lightGrey,
  primaryBlue,
  primaryGreen,
  white,
} from '../style';
import { Button } from 'react-native-paper';

const GroupButton = ({ disable, onpress, style }) => {
  return (
    <View
      style={[GlobalStyle.centerContent, StepSheetStyle.buttonGroup, style]}>
      <View
        style={[
          GlobalStyle.Shadow15,
          StepSheetStyle.buttonDisable,
          GlobalStyle.container,
          StepSheetStyle.buttonSpace,
        ]}>
        <Button
          mode="outlined"
          style={[StepSheetStyle.buttonTabs]}
          labelStyle={[
            GlobalStyle.signUpButtonLabel,
            StepSheetStyle.buttonLabel,
          ]}>
          Überspringen
        </Button>
      </View>
      <View
        style={[
          GlobalStyle.container,
          StepSheetStyle.buttonSpace,
          !disable
            ? [
                GlobalStyle.Shadow25,
                { backgroundColor: primaryGreen, shadowColor: primaryGreen },
              ]
            : {},
        ]}>
        <Button
          mode="contained"
          disabled={disable}
          onPress={onpress}
          style={[
            GlobalStyle.signUpButton,
            { backgroundColor: !disable ? primaryGreen : lightGrey },
          ]}
          labelStyle={[GlobalStyle.signUpButtonLabel]}>
          Weiter
        </Button>
      </View>
    </View>
  );
};

export default GroupButton;

const StepSheetStyle = StyleSheet.create({
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },
  buttonTabs: {
    borderColor: primaryBlue,
    borderRadius: 7,
    borderWidth: 2,
  },
  buttonLabel: {
    color: primaryBlue,
    fontSize: 16,
  },
  buttonDisable: {
    backgroundColor: white,
    borderRadius: 8,
    shadowColor: 'grey',
  },
  buttonSpace: {
    marginHorizontal: 10,
  },
});
