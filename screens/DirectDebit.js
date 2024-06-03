import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlobalStyle, { inputOutlineColor, primaryBlue, white } from '../style';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Wrapper from '../components/Wrapper';
import InputBox from '../components/InputBox';
import { useDispatch, useSelector } from 'react-redux';
import { AddDirectDebit } from '../store/actions/registration';
import GroupButton from '../components/GroupButton';
import { useNavigation } from '@react-navigation/native';
import { getAuthToken } from '../store/actions/helpers';
import { meineapagapi } from '../env';

/**
 * Displays the Direct Debit screen to Meine APAG.
 *
 * @Function DirectDebitScreen
 * @extends {Component}
 */
const DirectDebit = () => {
  const formData = useSelector(({ registration: t }) => t.directDebit);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const back = useCallback(
    (option, index) => {
      navigation.navigate('AntragFlow', { screen: 'PaymentMode' });
    },
    [navigation],
  );

  const onPressFunction = () => {
    dispatch((_, getState) => {
      const state = getState();
      const newFormData = state.registration.directDebit;
      return getAuthToken(dispatch, getState).then(accessToken => {
        return fetch(meineapagapi + 'api/v1/user/updatePaymentDetails', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify(newFormData),
        })
          .then(response => response.json())
          .then(responseJson => {
            navigation.navigate('AntragFlow', { screen: 'ConfirmEmail' });
            // @TODO in future below screen
            // navigation.navigate('AntragFlow', { screen: 'AddVehicle' });
          });
      });
    });
  };

  let disable = Boolean(!formData.IBAN || !formData.BIC || !formData.allow);

  return (
    <Wrapper handleBack={back}>
      <View style={[GlobalStyle.noMarginTop, { paddingVertical: 10 }]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, { paddingTop: 20 }]}>
          {'Lastschrift'}
        </Text>
      </View>
      <View>
        <InputBox
          placeholder="IBAN"
          value={formData.IBAN}
          onchange={text =>
            dispatch(AddDirectDebit({ name: 'IBAN', value: text }))
          }
        />
        <InputBox
          placeholder="BIC"
          value={formData.BIC}
          onchange={text =>
            dispatch(AddDirectDebit({ name: 'BIC', value: text }))
          }
        />
        <View style={StepSheetStyle.checkboxContainer}>
          <BouncyCheckbox
            size={25}
            fillColor={primaryBlue}
            unfillColor={white}
            isChecked={formData.allow}
            iconStyle={GlobalStyle.borderRadius7}
            innerIconStyle={[
              GlobalStyle.borderRadius7,
              {
                borderWidth: 2,
                borderColor: formData.allow ? primaryBlue : inputOutlineColor,
              },
            ]}
            onPress={isChecked =>
              dispatch(AddDirectDebit({ name: 'allow', value: isChecked }))
            }
          />
          <Text
            style={[
              GlobalStyle.title,
              GlobalStyle.normal16,
              { fontWeight: '400', width: '90%' },
            ]}>
            Ich erlaube der Aachener Parkhaus GmbH alle in Anspruch genommenen
            Leistungen über die oben angegebenen Bankdaten per SEPA-Lastschrift
            einzuziehen. Das SEPA-Mandat wird Ihnen zusammen mit Ihren
            Vertragsunterlagen übermittelt.
          </Text>
        </View>
      </View>
      <GroupButton
        disable={disable}
        onpress={onPressFunction}
        style={{ paddingTop: 60 }}
      />
    </Wrapper>
  );
};

export default DirectDebit;

const StepSheetStyle = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingTop: 20,
  },
});
