import React, { useCallback } from 'react';
import { View, Alert, Text, StyleSheet } from 'react-native';
import GlobalStyle, { primaryBlue } from '../style';
import Wrapper from '../components/Wrapper';
import { useSelector } from 'react-redux';
import RadioButtonGroup from '../components/RadioButtonGroup';
import GroupButton from '../components/GroupButton';
import { useNavigation } from '@react-navigation/native';

/**
 * Displays the Payment screen to Meine APAG.
 *
 * @class Steeper
 * @extends {Component}
 */
const PaymentMode = props => {
  const navigation = useNavigation();
  const paymentMode = useSelector(({ registration: t }) => t.paymentMode);
  const onPressFunction = () => {
    if (!paymentMode) {
      Alert.alert('Please Select Payment Mode!');
      return;
    }
    if (paymentMode === 'Lastschrift') {
      navigation.navigate('AntragFlow', { screen: 'DirectDebit' });
    } else if (paymentMode === 'Kreditkarte') {
      navigation.navigate('AntragFlow', { screen: 'CreditCard' });
    } else {
      navigation.navigate('AntragFlow', { screen: 'CreditCard' });
    }
  };

  const back = useCallback(
    (option, index) => {
      navigation.navigate('AntragFlow', { screen: 'Invoice' });
    },
    [navigation],
  );

  return (
    <Wrapper style={{ padding: 0, paddingHorizontal: 0 }} handleBack={back}>
      <View
        style={[GlobalStyle.containerSmallPadding, GlobalStyle.noMarginTop]}>
        <Text
          variant="headlineSmall"
          style={[
            GlobalStyle.title,
            { paddingTop: 20, paddingHorizontal: 20, fontWeight: '400' },
          ]}>
          {'Wählen Sie Ihre'}{' '}
          <Text style={[GlobalStyle.title, { alignSelf: 'center' }]}>
            {'gewünschte Zahlungsmethode'}{' '}
          </Text>
          {
            'aus. Änderungen lassen sich später in Ihren Account-Einstellungen vornehmen.'
          }
        </Text>
      </View>
      <View style={{ marginTop: 30 }}>
        <RadioButtonGroup />
      </View>
      <GroupButton
        disable={!Boolean(paymentMode)}
        onpress={onPressFunction}
        style={[
          StepSheetStyle.buttonGroup,
          GlobalStyle.primaryCont,
          {
            marginTop: 100,
            paddingHorizontal: 20,
          },
        ]}
      />
    </Wrapper>
  );
};

export default PaymentMode;

const StepSheetStyle = StyleSheet.create({
  buttonGroup: {
    alignItems: 'baseline',
    paddingTop: 80,
  },
  buttonTabs: {
    borderColor: primaryBlue,
    borderWidth: 2,
    borderRadius: 7,
  },
  buttonLabel: {
    color: primaryBlue,
    fontSize: 16,
  },
  radioItem: {
    borderRadius: 30,
  },
});
