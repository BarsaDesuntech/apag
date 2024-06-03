import React, { useCallback, useEffect } from 'react';
import { View, Image, StyleSheet, Platform, Text } from 'react-native';
import { Button } from 'react-native-paper';
import GlobalStyle, { fontScale, primaryBlue } from '../style';
import { CustomActionSheet } from '../components/ActionSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';
import { CommonActions, useNavigation } from '@react-navigation/native';

export const SplashScreenSVGsrc = require('../assets/img/services_splashscreen.png');

const LaunchLoginScreen = props => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const skip = useCallback(
    (option, index) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AntragFlow',
            params: {
              screen: 'Advantages',
            },
          },
        ],
      });
    },
    [navigation],
  );

  useEffect(() => {
    dispatch(setIsInLaunchFlow());
  }, [dispatch]);

  const goToAntragScreen = () => {
    dispatch(setIsInLaunchFlow(false));
    dispatch(hasSeenLaunchLoginScreen(true));
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              routes: [
                {
                  name: 'MeineAPAG',
                  state: {
                    routes: [
                      {
                        name: 'MeineAPAGLogin',
                      },
                      {
                        name: 'MeineAPAGAntrag',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      }),
    );
  };

  const goToRegisterScreen = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AntragFlow',
          params: {
            screen: 'RegisterForm',
          },
        },
      ],
    });
  };

  const goToLoginScreen = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Main',
          params: {
            screen: 'MeineAPAG',
            params: {
              screen: 'MeineAPAGLogin',
            },
          },
        },
      ],
    });
  };

  return (
    <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
      <Image
        source={SplashScreenSVGsrc}
        resizeMode="contain"
        style={[
          LaunchPopperStyle.logo,
          {
            top: Platform.OS === 'android' || !insets.top ? '5%' : insets.top,
            alignSelf: 'center',
          },
        ]}
        fadeDuration={0}
      />
      <CustomActionSheet>
        <View>
          <Button
            onPress={goToRegisterScreen}
            style={GlobalStyle.signUpButton}
            labelStyle={GlobalStyle.signUpButtonLabel}
            mode="contained">
            Account erstellen
          </Button>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 8,
            }}>
            <View
              style={{ flex: 1, height: 1, backgroundColor: '#00000029' }}
            />
            <View>
              <Text
                style={{
                  width: 50,
                  textAlign: 'center',
                  color: '#92a0b6',
                  fontWeight: 'bold',
                  fontSize: 12 * fontScale,
                }}>
                ODER
              </Text>
            </View>
            <View
              style={{ flex: 1, height: 1, backgroundColor: '#00000029' }}
            />
          </View>

          <Button
            onPress={goToLoginScreen}
            style={GlobalStyle.signInButton}
            labelStyle={GlobalStyle.signInButtonLabel}
            mode="contained">
            Ich habe bereits einen Account
          </Button>

          <Button
            onPress={skip}
            style={[
              GlobalStyle.skipButton,
              { marginTop: 50, marginBottom: 10 },
            ]}
            labelStyle={GlobalStyle.skipButtonLabel}
            mode="text">
            Überspringen
          </Button>
        </View>
      </CustomActionSheet>
    </View>
  );
};

const LaunchPopperStyle = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    color: '#324b72',
    fontSize: fontScale * 20,
  },
  logo: {
    width: '90%',
    height: '50%',
  },
  privacyText: {
    fontSize: fontScale * 14,
  },
});

export default LaunchLoginScreen;
