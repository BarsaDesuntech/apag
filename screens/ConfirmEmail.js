import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle, {
  black,
  fontScale,
  primaryBlue,
  primaryGreen,
} from '../style';
import { Button } from 'react-native-paper';
import Wrapper from '../components/Wrapper';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';
import { getUser } from '../store/selectors/user';

export const CheckSrc = require('../assets/img/check.png');

/**
 * Displays the login screen to Meine APAG.
 *
 * @class LoginScreen
 * @extends {Component}
 */
const ConfirmEmail = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const skip = useCallback(
    (option, index) => {
      dispatch(setIsInLaunchFlow(false));
      dispatch(hasSeenLaunchLoginScreen(true));
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
          },
        ],
      });
    },
    [navigation, dispatch],
  );

  return (
    <Wrapper checkTrueConfirm={true}>
      <View style={[GlobalStyle.noMarginTop, { paddingHorizontal: 5 }]}>
        <Text
          variant="headlineSmall"
          style={[GlobalStyle.title, GlobalStyle.mb20, { paddingTop: 20 }]}>
          {`Hallo ${user.details.Name1},`}{' '}
          <Text
            style={[
              GlobalStyle.title,
              { alignSelf: 'center', fontWeight: '400' },
            ]}>
            {'ab sofort sind Sie bereit für die Nutzung unserer Angebote.'}
          </Text>
        </Text>
        <Text
          variant="headlineSmall"
          style={[
            GlobalStyle.title,
            { alignSelf: 'center', fontWeight: '400' },
          ]}>
          {'In Ihren'}{' '}
          <Text style={[GlobalStyle.title, { alignSelf: 'center' }]}>
            {'Account-Einstellungen'}{' '}
          </Text>
          <Text
            style={[
              GlobalStyle.title,
              { alignSelf: 'center', fontWeight: '400' },
            ]}>
            {
              'haben Sie jederzeit die Möglichkeit Ihre persönlichen Daten zu aktualisieren und Ihre Zahlungsmethode oder Fahrzeuge zu ändern.'
            }
          </Text>
        </Text>
        <View style={{ marginTop: 200 }}>
          <Text
            variant="labelLarge"
            style={[
              LaunchPopperStyle.privacyText,
              GlobalStyle.normal14,
              { textAlign: 'center', color: black },
            ]}>
            {'Informationen zum '}
            <Text
              variant="labelLarge"
              style={[{ color: primaryBlue, fontWeight: 'bold' }]}
              onPress={skip}>
              {'Datenschutz'}
            </Text>
          </Text>
          <View
            style={[
              GlobalStyle.Shadow15,
              {
                marginBottom: 18,
                backgroundColor: primaryGreen,
                shadowColor: primaryGreen,
              },
            ]}>
            <Button
              onPress={skip}
              style={GlobalStyle.signUpButton}
              labelStyle={GlobalStyle.signUpButtonLabel}
              mode="contained">
              Los geht’s
            </Button>
          </View>
        </View>
      </View>
    </Wrapper>
  );
};

export default ConfirmEmail;

const LaunchPopperStyle = StyleSheet.create({
  privacyText: {
    fontSize: fontScale * 14,
    marginTop: -15,
    marginBottom: 20,
  },
});
