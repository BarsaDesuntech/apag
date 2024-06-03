import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CommonActions } from '@react-navigation/native';
import { connect } from 'react-redux';
import ButtonPrimary from '../components/buttonPrimary';
import ButtonTransparent from '../components/buttonTransparent';
import GlobalStyle from '../style';
import { LOGGED_IN } from '../store/actions/constants';
import { login, getCurrentUser, nupsiLogin } from '../store/actions/user';
import Notice from '../components/notice';
import Hoshi from '../components/react-native-textinput-effects/lib/Hoshi';
import { GOT_CURRENT_USER } from '../store/actions/constants';

/**
 * Displays the login screen to Meine APAG.
 *
 * @class LoginScreen
 * @extends {Component}
 */
class LoginScreen extends Component {
  state = {
    user_name: '',
    password: '',
    nupsiIngoing: false,
  };

  /**
   * Handles some routings for the authentication
   *
   * @memberof LoginScreen
   */
  componentDidMount() {
    const that = this;
    const identifier = false;
    // Verify if the user logged in
    if (
      typeof this.props.user.isLoggedIn !== typeof undefined &&
      this.props.user.isLoggedIn
    ) {
      // Check if the user has to reset his password if so redirect to the reset form
      // @todo refactor and logic check
      const decision =
        typeof this.props.user !== typeof undefined &&
        typeof this.props.user.reset !== typeof undefined &&
        this.props.user.reset === 'password';
      that.props.getCurrentUser().then(response => {
        if (response.type === GOT_CURRENT_USER) {
          if (
            typeof response.user !== typeof undefined &&
            typeof response.user.passwordChangeOnce !== typeof undefined &&
            response.user.passwordChangeOnce === 1
          ) {
            if (!decision) {
              that.navigatePasswordReset();
            }
          } else {
            if (decision) {
              that.navigateLoggedIn();
            }
          }
        }
      });
      // @todo is this part only needed when the promise/request takes longer
      if (decision) {
        that.navigatePasswordReset();
      } else {
        that.navigateLoggedIn();
      }
      // else-case handles the case for login using RFID-Chip (Nupsi/Mobility-Key)
    } else {
      // Extract identifier (RFID UUID) from intent url apag://nupsi/RFIDUUID
      // @todo reenable nupsi login
      // const {route} = this.props;
      // const {identifier} = route.params;
      if (
        typeof identifier !== typeof undefined &&
        identifier !== null &&
        identifier
      ) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({ nupsiIngoing: true });
        this.props
          .nupsiLogin({
            identifier,
          })
          .then(res => {
            if (res.type === LOGGED_IN) {
              // Verify if the user has to reset his password
              if (
                typeof res.user !== typeof undefined &&
                typeof res.user.reset !== typeof undefined &&
                res.user.reset === 'password'
              ) {
                that.navigatePasswordReset();
                // If the login was successfull redirect to Dashboard
              } else {
                that.props.getCurrentUser().then(() => {
                  that.navigateLoggedIn();
                });
              }
            } else {
              this.setState({ nupsiIngoing: false });
              Alert.alert(
                'Anmeldung',
                'Leider stimmen Ihre Daten nicht. Versuchen Sie es erneut!',
              );
            }
          });
      }
    }
  }

  /**
   * Executes Redux action login and navigates to Dashboard if successful.
   *
   * @memberof LoginScreen
   */
  login = () => {
    const that = this;
    const { user_name, password } = this.state;
    // Validate if the username and password are not empty
    if (user_name !== '' && password !== '') {
      // Send login information to the Meine APAG API
      this.props
        .login({
          email: user_name,
          password,
        })
        .then(res => {
          if (res.type === LOGGED_IN) {
            // Check if the user has to reset his password
            if (
              typeof res.user !== typeof undefined &&
              typeof res.user.reset !== typeof undefined &&
              res.user.reset === 'password'
            ) {
              that.navigatePasswordReset();
            } else {
              that.navigateLoggedIn();
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
  };

  /**
   * Navigates to the Dashboard
   *
   * @memberof LoginScreen
   */
  navigateLoggedIn = () => {
    const { navigation } = this.props;
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAG' }],
    });
    navigation.dispatch(resetAction);
  };

  /**
   * Navigates to the password reset form
   *
   * @memberof LoginScreen
   */
  navigatePasswordReset = () => {
    const { navigation } = this.props;
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: 'MeineAPAGPasswordReset' }],
    });
    navigation.dispatch(resetAction);
  };

  // Open the Kundenantrag inside the browser
  openKundenantrag = () => {
    const { navigation } = this.props;
    navigation.navigate('MeineAPAGAntrag');
  };

  // Open the password reset form inside the app
  openPassword = () => {
    const { navigation } = this.props;
    navigation.navigate('MeineAPAGPassword');
  };

  render() {
    const { user } = this.props;
    const { password, user_name } = this.state;
    // ScrollView using the KeyboardAwareScrollView package to let the screen scroll up when the keyboard is showing up
    // Simple login form where you can enter username and password
    // Beyond there two buttons either open the Kundenantrag or the password reset form
    return (
      <KeyboardAwareScrollView
        style={[
          GlobalStyle.container,
          GlobalStyle.keyboardAwareScrollViewCustomStyle,
        ]}
        enableOnAndroid={true}
        keyboardShouldPersistTaps={'handled'}
        extraHeight={0}
        extraScrollHeight={0}>
        <Notice
          title="Anmeldung"
          texts={[
            'Geben Sie Ihre Zugangsdaten ein und erhalten Sie Einsicht in Ihre monatliche Rechnungen, Kundendaten usw.',
          ]}
        />
        <View>
          <View
            style={[
              GlobalStyle.containerSmallPadding,
              GlobalStyle.noMarginTop,
            ]}>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                height={36}
                useNativeDriver={false}
                onChangeText={text => this.setState({ user_name: text })}
                value={user_name}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Kundennummer oder Benutzername"
                labelStyle={{}}
              />
            </View>
            <View>
              <Hoshi
                borderColor={'#3F6CB1'}
                borderHeight={2}
                inputPadding={4}
                height={36}
                useNativeDriver={false}
                onChangeText={text => this.setState({ password: text })}
                value={password}
                inputStyle={GlobalStyle.hoshiInputStyle}
                label="Passwort"
                labelStyle={{}}
                secureTextEntry={true}
                style={GlobalStyle.mt10}
              />
            </View>
          </View>
        </View>
        <View style={GlobalStyle.resetPasswordButtonContainer}>
          <ButtonTransparent
            text="Passwort vergessen?"
            onPress={this.openPassword}
            style={[GlobalStyle.w100, GlobalStyle.transparentBackground]}
            textStyle={GlobalStyle.primaryTextColor}
          />
        </View>
        <View style={GlobalStyle.resetContainer}>
          <ButtonPrimary
            text="Anmelden"
            onPress={this.login}
            style={[GlobalStyle.w100, GlobalStyle.mt10]}
            loading={user.isFetching}
          />
        </View>
        <View>
          <View style={GlobalStyle.resetContainer}>
            <ButtonPrimary
              text="Jetzt registrieren"
              onPress={this.openKundenantrag}
              style={[
                GlobalStyle.w100,
                GlobalStyle.primaryGreenBackgroundColor,
              ]}
              underlayColor="#7f972b"
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    login: params => dispatch(login(params)),
    nupsiLogin: params => dispatch(nupsiLogin(params)),
    getCurrentUser: () => dispatch(getCurrentUser()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
