import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle from '../style';
import Wrapper from '../components/Wrapper';
import CustomDatePicker from '../components/DatePicker';
import InputBox from '../components/InputBox';
import { AddCreditCard } from '../store/actions/registration';
import GroupButton from '../components/GroupButton';
import { useNavigation } from '@react-navigation/native';

/**
 * Displays the creditCard screen to Meine APAG.
 *
 * @function CreditCardScreen
 * @extends {Component}
 */
const CreditCard = () => {
  const formData = useSelector(({ registration: t }) => t.creditCard);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const back = useCallback(
    (option, index) => {
      navigation.navigate('AntragFlow', { screen: 'PaymentMode' });
    },
    [navigation],
  );

  const onPressFunction = () => {
    navigation.navigate('AntragFlow', { screen: 'AddVehicle' });
  };

  let disable = Boolean(
    !formData.cardholders ||
      !formData.cardNumber ||
      !formData.expiryDate ||
      !formData.securityCode,
  );

  return (
    <Wrapper handleBack={back}>
      <View>
        <View style={[{ paddingVertical: 10 }, GlobalStyle.noMarginTop]}>
          <Text
            variant="headlineSmall"
            style={[GlobalStyle.title, { paddingTop: 20 }]}>
            {'Kreditkarte'}
          </Text>
        </View>
        <View>
          <InputBox
            value={formData.cardholders}
            placeholder="Kontoinhaber"
            onchange={text =>
              dispatch(AddCreditCard({ name: 'cardholders', value: text }))
            }
          />
          <InputBox
            value={formData.cardNumber}
            placeholder="Kartennummer"
            onchange={text =>
              dispatch(AddCreditCard({ name: 'cardNumber', value: text }))
            }
          />
          <View style={StepSheetStyle.checkboxContainer}>
            <View>
              <Text
                variant="headlineSmall"
                style={[
                  GlobalStyle.title,
                  GlobalStyle.normal16,
                  { fontWeight: '600' },
                ]}>
                {'Verfallsdatum'}
              </Text>
              <CustomDatePicker />
            </View>
            <View style={{ width: 50 }} />
            <View>
              <Text
                variant="headlineSmall"
                style={[
                  GlobalStyle.title,
                  GlobalStyle.normal16,
                  { fontWeight: '600' },
                ]}>
                {'Sicherheitscode'}
              </Text>
              <InputBox
                value={formData.securityCode}
                placeholder="CVC"
                onchange={text =>
                  dispatch(AddCreditCard({ name: 'securityCode', value: text }))
                }
              />
            </View>
          </View>
        </View>
      </View>
      <GroupButton
        disable={disable}
        onpress={onPressFunction}
        style={{ paddingTop: 150 }}
      />
    </Wrapper>
  );
};

export default CreditCard;

const StepSheetStyle = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
    paddingTop: 20,
  },
});
