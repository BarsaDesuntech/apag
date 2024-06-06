import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Alert, Text } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ButtonTransparent from '../components/buttonTransparent';
import GlobalStyle, {
  inputOutlineColor,
  placeholderColor,
  primaryBlue,
} from '../style';
import { LOGGED_IN } from '../store/actions/constants';
import { login, getCurrentUser } from '../store/actions/user';
import { TextInput } from 'react-native-paper';
import { GOT_CURRENT_USER } from '../store/actions/constants';
import { getUser } from '../store/selectors/user';
import { CustomActionSheet } from '../components/ActionSheet';
import { Button } from 'react-native-paper';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';

/**
 * Displays the login screen to Meine APAG.
 *
 * @class LoginScreen
 * @extends {Component}
 */
const LoginScreen = props => {
  const dispatch = useDispatch();
  const [user_name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector(getUser);
  const navigation = useNavigation();
  const app = useSelector(({ app: t }) => t);

  /**
   * Navigates to the Dashboard
   *
   * @memberof LoginScreen
   */
  const navigateLoggedIn = useCallback(() => {
    dispatch(setIsInLaunchFlow(false));
    dispatch(hasSeenLaunchLoginScreen(true));
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAG' }],
    });
    navigation.dispatch(resetAction);
  }, [navigation, dispatch]);

  /**
   * Navigates to the password reset form
   *
   * @memberof LoginScreen
   */
  const navigatePasswordReset = useCallback(() => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAGPasswordReset' }],
    });
    navigation.dispatch(resetAction);
  }, [navigation]);

  /**
   * Executes Redux action login and navigates to Dashboard if successful.
   *
   * @memberof LoginScreen
   */
  const handleLogin = useCallback(() => {
    // Validate if the username and password are not empty
    if (user_name !== '' && password !== '') {
      // Send login information to the Meine APAG API
      dispatch(
        login({
          email: user_name,
          password,
        }),
      ).then(res => {
        if (res.type === LOGGED_IN) {
          // Check if the user has to reset his password
          if (
            typeof res.user !== typeof undefined &&
            typeof res.user.reset !== typeof undefined &&
            res.user.reset === 'password'
          ) {
            navigatePasswordReset();
          } else {
            navigateLoggedIn();
          }
          // If the user has not been logged in go through some standard issues
        } else {
          // Check if there has been a network error
          if (res.network) {
            Alert.alert(
              'Anmeldung',
              'Es trat ein Fehler bei der Anfrage zum Server auf.',
            );
          } else {
            // If there has been to many requests from the device the API will throttle the amount of allowed requests
            if (res.throttle) {
              Alert.alert('Anmeldung', res.response.errors.email[0]);
            } else {
              // For all other errors a general warning message is shown
              Alert.alert(
                'Anmeldung',
                'Leider stimmen Ihre Daten nicht. Versuchen Sie es erneut!',
              );
            }
          }
        }
      });
      // Show an validation error for the username or password
    } else {
      Alert.alert('Anmeldung', 'Es müssen alle Felder ausgefüllt sein!');
    }
  }, [user_name, password, dispatch, navigatePasswordReset, navigateLoggedIn]);

  /**
   * Handles some routings for the authentication
   *
   * @memberof LoginScreen
   */
  useEffect(() => {
    if (typeof user.isLoggedIn !== typeof undefined && user.isLoggedIn) {
      // Check if the user has to reset his password if so redirect to the reset form
      // @todo refactor and logic check
      const decision =
        typeof user !== typeof undefined &&
        typeof user.reset !== typeof undefined &&
        user.reset === 'password';
      dispatch(getCurrentUser()).then(response => {
        if (response.type === GOT_CURRENT_USER) {
          if (
            typeof response.user !== typeof undefined &&
            typeof response.user.passwordChangeOnce !== typeof undefined &&
            response.user.passwordChangeOnce === 1
          ) {
            if (!decision) {
              navigatePasswordReset();
            }
          } else {
            if (decision) {
              navigateLoggedIn();
            }
          }
        }
      });
      // @todo is this part only needed when the promise/request takes longer
      if (decision) {
        navigatePasswordReset();
      } else {
        navigateLoggedIn();
      }
    }
  }, [dispatch, navigateLoggedIn, navigatePasswordReset, user]);

  // Open the Kundenantrag inside the browser
  const openKundenantrag = useCallback(() => {
    navigation.navigate('AntragFlow');
  }, [navigation]);

  // Open the password reset form inside the app
  const openPassword = useCallback(() => {
    navigation.navigate('MeineAPAGPassword');
  }, [navigation]);

  const back = useCallback(() => {
    dispatch(hasSeenLaunchLoginScreen(false));
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'LaunchPopup',
        },
      ],
    });
  }, [dispatch, navigation]);

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

  const Wrapper = useMemo(
    () => ({ children }) =>
      app.app.isInLaunchFlow ? (
        <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
          <CustomActionSheet handleBack={back}>{children}</CustomActionSheet>
        </View>
      ) : (
        <View
          style={[
            GlobalStyle.container,
            { backgroundColor: '#fff', paddingHorizontal: 10 },
          ]}>
          {children}
        </View>
      ),
    [app.app.isInLaunchFlow, back],
  );

  // Simple login form where you can enter username and password
  // Beyond there two buttons either open the Kundenantrag or the password reset form
  return (
    <Wrapper>
      <View
        style={[GlobalStyle.containerSmallPadding, GlobalStyle.noMarginTop]}>
        <Text
          variant="headlineSmall"
          style={[
            GlobalStyle.title,
            { alignSelf: 'center', marginBottom: 5, paddingTop: 20 },
          ]}>
          {'Mit meine.apag-Daten anmelden'}
        </Text>
        <TextInput
          placeholder="Benutzername / Kundennummer"
          value={user_name}
          mode="outlined"
          outlineColor={inputOutlineColor}
          activeOutlineColor={primaryBlue}
          style={{ backgroundColor: '#fff', marginBottom: 5 }}
          outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
          placeholderTextColor={placeholderColor}
          onChangeText={text => setUsername(text)}
        />
        <TextInput
          placeholder="Passwort"
          value={password}
          mode="outlined"
          outlineColor={inputOutlineColor}
          activeOutlineColor={primaryBlue}
          style={{ backgroundColor: '#fff' }}
          outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
          placeholderTextColor={placeholderColor}
          onChangeText={text => setPassword(text)}
        />
        <ButtonTransparent
          text="Passwort vergessen?"
          onPress={openPassword}
          style={[GlobalStyle.w100, GlobalStyle.transparentBackground]}
          textStyle={[
            GlobalStyle.primaryTextColor,
            GlobalStyle.forgotPasswordText,
          ]}
        />
        <Button
          onPress={handleLogin}
          style={[
            GlobalStyle.signUpButton,
            { marginTop: app.app.isInLaunchFlow ? 150 : 0 },
          ]}
          labelStyle={GlobalStyle.signUpButtonLabel}
          mode="contained">
          Anmelden
        </Button>
        {!app.app.isInLaunchFlow && (
          <Button
            onPress={openKundenantrag}
            style={GlobalStyle.signInButton}
            labelStyle={GlobalStyle.signInButtonLabel}
            mode="contained">
            Account erstellen
          </Button>
        )}
        {app.app.isInLaunchFlow && (
          <Button
            onPress={skip}
            style={GlobalStyle.skipButton}
            labelStyle={GlobalStyle.skipButtonLabel}
            mode="text">
            Überspringen
          </Button>
        )}
      </View>
    </Wrapper>
  );
};

export default LoginScreen;
