import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, Linking, StyleSheet, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { Button, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import GlobalStyle, {
  black,
  fontScale,
  primaryBlue,
  primaryGreen,
  white,
} from '../style';
import { saveConsentSettings } from '../store/actions/consent';
import { selectConsent } from '../store/selectors/selectConsent';
import { CustomActionSheet } from '../components/ActionSheet';
import { ConsentOption } from '../components/ConsentOption';
import { BugnsnagInfo } from '../components/BugsnagDetails';
import { PushDetails } from '../components/PushDetails';
import { CardDetails } from '../components/CardDetails.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const APAGImageSrc = require('../img/apaglogo.png');

const LaunchPopper = props => {
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState({
    maps: false,
    push: false,
    bugsnag: false,
  });
  const { consent } = useSelector(selectConsent);
  const dispatch = useDispatch();

  const accept = useCallback(() => {
    dispatch(saveConsentSettings(settings));
  }, [settings, dispatch]);

  const changeSettings = useCallback(
    (id, value) => {
      setSettings({
        ...settings,
        [id]: value,
      });
    },
    [settings],
  );

  const showPrivacyDetails = () => {
    Linking.canOpenURL('https://www.apag.de/datenschutz').then(supported => {
      if (supported) {
        Linking.openURL('https://www.apag.de/datenschutz');
      } else {
        console.log(
          "Don't know how to open URI: https://www.apag.de/datenschutz",
        );
      }
    });
  };

  if (consent.filled) {
    return null;
  }

  return (
    <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
      <Image
        source={APAGImageSrc}
        resizeMode={'contain'}
        style={[
          LaunchPopperStyle.logo,
          { top: Platform.OS === 'android' || !insets.top ? '5%' : insets.top },
        ]}
        fadeDuration={0}
      />
      <CustomActionSheet
        content={
          <>
            <Text variant="headlineSmall" style={GlobalStyle.title}>
              {'Ich erkläre mich einverstanden mit:'}
            </Text>
            <ConsentOption
              label="Einbindung von"
              labelSuffix="externem Kartenmaterial und Nutzung von Standortdaten"
              DetailComponent={CardDetails}
              changeSettings={changeSettings}
              id="maps"
              value={settings.maps}
            />
            <ConsentOption
              label="Nutzung von"
              labelSuffix="Push-Services"
              DetailComponent={PushDetails}
              changeSettings={changeSettings}
              id="push"
              value={settings.push}
            />
            <ConsentOption
              label="Einbindung von"
              labelSuffix="externem Diensten zur Fehleranalyse"
              DetailComponent={BugnsnagInfo}
              changeSettings={changeSettings}
              id="bugsnag"
              value={settings.bugsnag}
            />
          </>
        }>
        <View style={LaunchPopperStyle.bottomContainer}>
          <Text
            variant="labelLarge"
            style={[
              LaunchPopperStyle.privacyText,
              { textAlign: 'center', color: black },
            ]}>
            {'Informationen zum '}
            <Text
              variant="labelLarge"
              style={[
                LaunchPopperStyle.privacyText,
                { color: primaryBlue, fontWeight: 'bold' },
              ]}
              onPress={showPrivacyDetails}>
              {'Datenschutz'}
            </Text>
          </Text>
          <Button
            style={LaunchPopperStyle.continueButton}
            labelStyle={LaunchPopperStyle.continueButtonLabel}
            mode="contained"
            onPress={accept}>
            Fortfahren
          </Button>
        </View>
      </CustomActionSheet>
    </View>
  );
};

const LaunchPopperStyle = StyleSheet.create({
  logo: {
    height: '9%',
    position: 'absolute',
    top: '5%',
    right: 0,
    left: 0,
    width: '100%',
  },
  privacyText: {
    fontSize: fontScale * 14,
  },
  bottomContainer: {
    marginTop: 50,
    width: '100%',
    paddingHorizontal: 20,
  },
  continueButton: {
    marginVertical: 10,
    backgroundColor: primaryGreen,
    borderRadius: 6,
    paddingVertical: 2,
  },
  continueButtonLabel: {
    fontSize: fontScale * 18,
    fontWeight: 'bold',
    color: white,
  },
});

export default LaunchPopper;
