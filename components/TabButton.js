import { StyleSheet, View } from 'react-native';
import React from 'react';
import GlobalStyle, { lightGrey200, primaryBlue } from '../style';
import { customerType } from '../helpers/constant';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeCustomerType } from '../store/actions/registration';

const TabButton = () => {
  const dispatch = useDispatch();
  const selectedType = useSelector(state => state.registration.type);

  const changeCustomerType = name => {
    dispatch(ChangeCustomerType(name));
  };

  return (
    <View style={StepSheetStyle.buttonGroup}>
      {customerType.map(list => (
        <View style={{ flex: 1 }} key={list.value}>
          <Button
            onPress={() => changeCustomerType(list.value)}
            style={[
              list.value === selectedType
                ? StepSheetStyle.buttonActive
                : StepSheetStyle.buttonTabs,
            ]}
            contentStyle={{ height: '100%' }}
            labelStyle={[
              GlobalStyle.signUpButtonLabel,
              list.value !== selectedType ? StepSheetStyle.buttonLabel : '',
            ]}>
            {list.label}
          </Button>
        </View>
      ))}
    </View>
  );
};

export default TabButton;

const StepSheetStyle = StyleSheet.create({
  buttonGroup: {
    flexDirection: 'row',
    borderColor: lightGrey200,
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    height: 50,
    marginVertical: 15,
  },
  buttonTabs: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  buttonActive: {
    backgroundColor: primaryBlue,
    height: '100%',
    width: '100%',
    borderRadius: 8,
  },
  buttonLabel: {
    color: primaryBlue,
  },
});
