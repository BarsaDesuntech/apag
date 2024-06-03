import React, { useEffect, useState } from 'react';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonPrimary from '../components/buttonPrimary';
import GlobalStyle from '../style';
import { UPDATE_PASSWORD_FAILURE } from '../store/actions/constants';
import { updatePassword, getCurrentUser } from '../store/actions/user';
import Notice from '../components/notice';
import Hoshi from '../components/react-native-textinput-effects/lib/Hoshi';
import { CommonActions } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../store/selectors/user';

/**
 * Displays the password reset form if already logged in
 *
 * @class PasswordResetScreen
 * @extends {Component}
 */
const PasswordResetScreen = () => {
  const [old_password, setOldPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [new_password_retype, setNewPasswordRetype] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const savePassword = params => dispatch(updatePassword(params));

  useEffect(() => {
    const getUser = params => dispatch(getCurrentUser(params));
    const interval = setInterval(() => getUser(false), 3000);
    return () => clearInterval(interval);
  }, [dispatch]);

  /**
   * Navigates to the dashboard
   *
   * @memberof PasswordScreen
   */
  const navigateLoggedIn = () => {
    if (this) {
      const { navigation } = this.props;
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ routeName: 'MeineAPAG' }],
      });
      navigation.dispatch(resetAction);
    }
  };

  const checkResetState = () => {
    if (
      typeof user !== typeof undefined &&
      typeof user.reset !== typeof undefined &&
      user.reset === 'password'
    ) {
    } else {
      // If the request is not done yet do not redirect
      if (!isSaving) {
        navigateLoggedIn();
      }
    }
  };

  // Check if the user has to reset his password => If not redirect to Dashboard
  checkResetState();

  /**
   * Executes Redux action login and navigates to Dashboard if successful.
   *
   * @memberof PasswordResetScreen
   */
  const changePassword = () => {
    return new Promise((resolve, reject) => {
      // Validate that all inputs are filled
      if (
        old_password !== '' &&
        new_password !== '' &&
        new_password_retype !== ''
      ) {
        // Show a loading indicator
        setIsSaving(true);
        // Send password reset request to the Meine APAG API
        savePassword({
          old_password,
          new_password,
          new_password_retype,
        }).then(res => {
          // Stop loading indicator
          setIsSaving(false);
          // Show an error message if something has gone wrong
          if (res.type === UPDATE_PASSWORD_FAILURE) {
            Alert.alert('Hinweis', buildErrorMessage(res.errors));
            resolve();
            // Show an success message if everything has gone well
          } else {
            navigateLoggedIn();
            Alert.alert('Hinweis', 'Ihr Passwort wurde aktualisiert.');
            resolve();
          }
        });
      } else {
        Alert.alert('Anmeldung', 'Es müssen alle Felder ausgefüllt sein!');
      }
    });
  };

  // Build an error message based on the API response
  const buildErrorMessage = errors => {
    let message = '';
    let keys = Object.keys(errors);
    for (var i = 0; i < keys.length; i++) {
      if (errors[keys[i]][0] !== 'error') {
        message += errors[keys[i]][0] + '\n';
      }
    }
    return message;
  };

  // ScrollView using the KeyboardAwareScrollView package to let the screen scroll up when the keyboard is showing up
  // Simple form with 3 inputs for the passwords
  return (
    <KeyboardAwareScrollView
      style={[
        GlobalStyle.container,
        GlobalStyle.keyboardAwareScrollViewCustomStyle,
      ]}
      enableOnAndroid={true}
      keyboardShouldPersistTaps={'handled'}>
      <Notice
        title="Passwort zurücksetzen"
        texts={[
          'Ihr Passwort ist abgelaufen. Sie müssen ein neues Passwort auswählen!',
        ]}
      />
      <View>
        <View
          style={[GlobalStyle.containerSmallPadding, GlobalStyle.noMarginTop]}>
          <View>
            <Hoshi
              borderColor={'#3F6CB1'}
              borderHeight={2}
              inputPadding={4}
              height={36}
              onChangeText={text => setOldPassword(text)}
              value={old_password}
              inputStyle={GlobalStyle.hoshiInputStyle}
              label="Altes Passwort"
              secureTextEntry={true}
              labelStyle={{}}
              useNativeDriver={false}
            />
          </View>
          <View>
            <Hoshi
              borderColor={'#3F6CB1'}
              borderHeight={2}
              inputPadding={4}
              useNativeDriver={false}
              height={36}
              onChangeText={text => setNewPassword(text)}
              value={new_password}
              inputStyle={GlobalStyle.hoshiInputStyle}
              label="Neues Passwort"
              secureTextEntry={true}
              style={GlobalStyle.mt10}
            />
          </View>
          <View>
            <Hoshi
              borderColor={'#3F6CB1'}
              borderHeight={2}
              inputPadding={4}
              useNativeDriver={false}
              height={36}
              onChangeText={text => setNewPasswordRetype(text)}
              value={new_password_retype}
              inputStyle={GlobalStyle.hoshiInputStyle}
              label="Neues Passwort bestätigen"
              secureTextEntry={true}
              style={GlobalStyle.mt10}
            />
          </View>
        </View>
      </View>
      <View style={GlobalStyle.resetContainer}>
        <ButtonPrimary
          text="Passwort zurücksetzen"
          onPress={changePassword}
          style={[GlobalStyle.w100, GlobalStyle.mt10]}
          loading={isSaving}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default PasswordResetScreen;
