import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, Alert, Text } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle, {
  inputOutlineColor,
  placeholderColor,
  primaryBlue,
} from '../style';
import { getCurrentUser } from '../store/actions/user';
import { TextInput } from 'react-native-paper';
import { GOT_CURRENT_USER } from '../store/actions/constants';
import { getUser } from '../store/selectors/user';
import { CustomActionSheet } from '../components/ActionSheet';
import { Button } from 'react-native-paper';
import {
  hasSeenLaunchLoginScreen,
  setIsInLaunchFlow,
} from '../store/actions/settings';
import { meineapagapi } from '../env';

/**
 * Displays the register screen to Meine APAG.
 *
 * @class RegisterScreen
 * @extends {Component}
 */
const RegisterScreen = props => {
  const checkUser = useRef(false);
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const disabled = !name || !email || !password;
  const user = useSelector(getUser);
  const navigation = useNavigation();
  const app = useSelector(({ app: t }) => t);

  /**
   * Navigates to the Dashboard
   *
   * @memberof RegisterScreen
   */
  const navigateLoggedIn = useCallback(() => {
    dispatch(setIsInLaunchFlow(false));
    dispatch(hasSeenLaunchLoginScreen(true));
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
    navigation.dispatch(resetAction);
  }, [navigation, dispatch]);

  /**
   * Navigates to the password reset form
   *
   * @memberof RegisterScreen
   */
  const navigatePasswordReset = useCallback(() => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAGPasswordReset' }],
    });
    navigation.dispatch(resetAction);
  }, [navigation]);

  const continueRegisterFlow = useCallback(
    token => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AntragFlow',
            params: {
              screen: 'EmailVerification',
              params: {
                token,
              },
            },
          },
        ],
      });
    },
    [navigation],
  );

  /**
   * Executes Redux action register and navigates to Dashboard if successful.
   *
   * @memberof RegisterScreen
   */
  const handleRegister = useCallback(() => {
    // Validate if the username and password are not empty
    if (email !== '' && name !== '' && password !== '') {
      fetch(meineapagapi + 'api/register/user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email,
          password,
          given_name: name,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson', responseJson);
          // Check if there have been any errors
          if (typeof responseJson.error !== typeof undefined) {
            Alert.alert('Anmeldung', responseJson.error);
          } else if (responseJson.message) {
            const messages = Object.keys(responseJson.message);
            console.log(messages, responseJson.message);
            if (messages.length) {
              Alert.alert('Anmeldung', responseJson.message[messages[0]][0]);
            } else {
              Alert.alert('Anmeldung', responseJson.message);
            }
          } else {
            console.log(responseJson);
            continueRegisterFlow(responseJson.mobile_token);
          }
        })
        .catch(error => {
          Alert.alert('Anmeldung', 'Etwas ist schief gelaufen!');
        });
      // Show an validation error for the username or password
    } else {
      Alert.alert('Anmeldung', 'Es müssen alle Felder ausgefüllt sein!');
    }
  }, [email, name, password, continueRegisterFlow]);

  /**
   * Handles some routings for the authentication
   *
   * @memberof RegisterScreen
   */
  useEffect(() => {
    if (
      typeof user.isLoggedIn !== typeof undefined &&
      user.isLoggedIn &&
      !checkUser.current
    ) {
      checkUser.current = true;
      dispatch(getCurrentUser()).then(response => {
        console.log(response);
        if (response.type === GOT_CURRENT_USER) {
          if (
            typeof response.user !== typeof undefined &&
            typeof response.user.passwordChangeOnce !== typeof undefined &&
            response.user.passwordChangeOnce === 1
          ) {
            navigatePasswordReset();
          } else {
            navigateLoggedIn();
          }
        }
      });
    }
  }, [dispatch, navigateLoggedIn, navigatePasswordReset, user]);

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

  // @TODO Fetch API to validate email
  // Simple register form where you can enter username and password
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
          {'meine.apag-Account erstellen'}
        </Text>
        <TextInput
          placeholder="Name"
          value={name}
          mode="outlined"
          autoComplete="name"
          outlineColor={inputOutlineColor}
          activeOutlineColor={primaryBlue}
          style={{ backgroundColor: '#fff', marginBottom: 5 }}
          outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
          placeholderTextColor={placeholderColor}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="E-Mail-Adresse"
          value={email}
          autoComplete="email"
          autoCapitalize="none"
          mode="outlined"
          outlineColor={inputOutlineColor}
          activeOutlineColor={primaryBlue}
          style={{ backgroundColor: '#fff', marginBottom: 5 }}
          outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
          placeholderTextColor={placeholderColor}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          placeholder="Passwort"
          value={password}
          mode="outlined"
          autoComplete="new-password"
          autoCapitalize="none"
          outlineColor={inputOutlineColor}
          activeOutlineColor={primaryBlue}
          style={{ backgroundColor: '#fff' }}
          outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
          placeholderTextColor={placeholderColor}
          onChangeText={text => setPassword(text)}
        />
        {/* @TODO add password strength meter */}
        <Button
          disabled={disabled}
          onPress={handleRegister}
          style={[
            disabled ? GlobalStyle.disableButton : GlobalStyle.signUpButton,
            { marginTop: app.app.isInLaunchFlow ? 150 : 20 },
          ]}
          labelStyle={GlobalStyle.signUpButtonLabel}
          mode="contained">
          Fortfahren
        </Button>
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

export default RegisterScreen;
