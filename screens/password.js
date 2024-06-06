import React, { useCallback, useMemo, useState } from 'react';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import GlobalStyle, {
  inputOutlineColor,
  placeholderColor,
  primaryBlue,
} from '../style';
import { resetPassword } from '../store/actions/user';
import Notice from '../components/notice';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { CustomActionSheet } from '../components/ActionSheet';
import { TextInput, Text, Button } from 'react-native-paper';

/**
 * Displays the password forgotten screen
 *
 * @class PasswordScreen
 * @extends {Component}
 */
const PasswordScreen = props => {
  const [email, setEmail] = useState('');
  const app = useSelector(({ app: t }) => t);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  /**
   * Sends the email address from state to the Meine APAG API to trigger an password reset email
   *
   * @memberof PasswordScreen
   */
  const handleClick = () => {
    // Validate if the email is empty
    if (email !== '') {
      dispatch(
        resetPassword({
          email,
        }),
      ).then(_res => {
        navigation.goBack();
        Alert.alert(
          'Hinweis',
          'Sofern Ihre E-Mail-Adresse mit einem gültigen Konto verknüpft ist, wurde eine E-Mail an Sie versendet.',
        );
      });
    } else {
      Alert.alert('Anmeldung', 'Es müssen alle Felder ausgefüllt sein!');
    }
  };

  /**
   * Navigates back
   *
   * @memberof PasswordScreen
   */
  const handleBack = useCallback(() => {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAGLogin' }],
    });
    navigation.dispatch(resetAction);
  }, [navigation]);

  const Wrapper = useMemo(
    () => ({ children }) =>
      app.app.isInLaunchFlow ? (
        <View style={[GlobalStyle.container, { backgroundColor: primaryBlue }]}>
          <CustomActionSheet handleBack={handleBack}>
            {children}
          </CustomActionSheet>
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
    [app.app.isInLaunchFlow, handleBack],
  );

  // ScrollView using the KeyboardAwareScrollView package to let the screen scroll up when the keyboard is showing up
  // Simple form with only an email input which triggers the forgotten password email reset if the submit button is hit
  return (
    <Wrapper>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        extraHeight={0}
        extraScrollHeight={0}>
        <Text
          variant="headlineSmall"
          style={[
            GlobalStyle.title,
            { alignSelf: 'center', marginBottom: 5, paddingTop: 20 },
          ]}>
          {'Passwort zurücksetzen'}
        </Text>
        <Notice
          texts={[
            'Geben Sie Ihre E-Mail-Adresse ein, um Ihr Passwort zurück zu setzen.',
          ]}
        />
        <View
          style={[GlobalStyle.containerSmallPadding, GlobalStyle.noMarginTop]}>
          <TextInput
            placeholder="E-Mail-Adresse"
            value={email}
            mode="outlined"
            outlineColor={inputOutlineColor}
            activeOutlineColor={primaryBlue}
            style={{ backgroundColor: '#fff', marginBottom: 5 }}
            outlineStyle={{ borderWidth: 2, borderRadius: 8 }}
            placeholderTextColor={placeholderColor}
            onChangeText={text => setEmail(text)}
          />
          <Button
            onPress={handleClick}
            style={[
              GlobalStyle.signUpButton,
              { marginTop: app.app.isInLaunchFlow ? 150 : 20 },
            ]}
            labelStyle={GlobalStyle.signUpButtonLabel}
            mode="contained">
            Passwort zurücksetzen
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </Wrapper>
  );
};

export default PasswordScreen;
